import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { publicClient } from "@/lib/supabase";
import { captureEmail, normalizeEmail } from "@/lib/substack";

// Back a topic — either an existing idea (ideaId) or a brand-new one
// (newTopic). Minimum backing is $5.
//
// With Stripe configured (STRIPE_SECRET_KEY set), this creates a Checkout
// session; the topic (for a new one) and the paid backing are both written
// only after payment succeeds, in recordPaidSession. Without Stripe — launch
// mode — the topic is created and an unpaid pledge is recorded, which RLS
// permits; 'paid' rows can only ever be written by fulfillment.

const MIN_CENTS = 500; // $5
const MAX_CENTS = 100000; // $1,000

export async function POST(req: NextRequest) {
  let body: {
    ideaId?: string;
    newTopic?: {
      title?: string;
      link?: string;
    };
    amountCents?: number;
    name?: string;
    email?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const amountCents = Math.round(Number(body.amountCents));
  const name = (body.name ?? "").trim().slice(0, 60);
  const email = normalizeEmail(body.email);

  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return NextResponse.json(
      { error: "Backing must be between $5 and $1,000." },
      { status: 400 }
    );
  }

  const supabase = publicClient();

  // Resolve the target. A brand-new topic is validated but NOT created yet —
  // the topic is only written once payment succeeds (in recordPaidSession), so
  // a cancelled checkout never leaves an unpaid topic on the board. An existing
  // topic is looked up and must be open.
  let idea: { id: string; title: string } | null = null;
  let newTopic: { title: string; link: string | null } | null = null;

  if (body.newTopic) {
    const title = (body.newTopic.title ?? "").trim();
    const link = (body.newTopic.link ?? "").trim();
    if (title.length < 3 || title.length > 140) {
      return NextResponse.json(
        { error: "Topic must be 3–140 characters." },
        { status: 400 }
      );
    }
    if (link && !/^https?:\/\//i.test(link)) {
      return NextResponse.json(
        { error: "Links must start with http(s)://" },
        { status: 400 }
      );
    }
    if (link.length > 500) {
      return NextResponse.json({ error: "Too long." }, { status: 400 });
    }
    newTopic = { title, link: link || null };
  } else {
    const ideaId = body.ideaId ?? "";
    if (!/^[0-9a-f-]{36}$/i.test(ideaId)) {
      return NextResponse.json({ error: "invalid idea" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("fi_ideas")
      .select("id, title, status")
      .eq("id", ideaId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Idea not found." }, { status: 404 });
    }
    if (data.status !== "open") {
      return NextResponse.json(
        { error: "This idea is no longer open for backing." },
        { status: 400 }
      );
    }
    idea = { id: data.id, title: data.title };
  }

  // Capture email (Supabase + best-effort Substack) — never blocks the flow.
  if (email) void captureEmail(email, "back");

  const title = idea ? idea.title : newTopic!.title;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    const origin =
      req.headers.get("origin") ??
      `https://${req.headers.get("host") ?? "localhost:3000"}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Back: ${title}`,
              description: "Funds coverage of this topic on the board.",
            },
          },
        },
      ],
      metadata: {
        idea_id: idea?.id ?? "",
        new_title: newTopic?.title ?? "",
        new_link: newTopic?.link ?? "",
        backer_name: name,
        backer_email: email ?? "",
        is_commission: "0",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/briefs#board`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Launch mode (no Stripe): no payment step, so create the topic if new and
  // record a pledge (RLS only allows status='pledged' here).
  let ideaId = idea?.id;
  if (!ideaId && newTopic) {
    const { data, error } = await supabase
      .from("fi_ideas")
      .insert({ title: newTopic.title, link: newTopic.link, category: "other" })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: "Could not create the topic. Try again." },
        { status: 500 }
      );
    }
    ideaId = data.id;
  }
  const { error: pledgeErr } = await supabase.from("fi_backings").insert({
    idea_id: ideaId,
    amount_cents: amountCents,
    backer_name: name || null,
    backer_email: email,
  });
  if (pledgeErr) {
    return NextResponse.json(
      { error: "Could not record the backing. Try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ pledged: true, ideaId });
}
