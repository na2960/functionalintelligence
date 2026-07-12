import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { publicClient } from "@/lib/supabase";
import { captureEmail, normalizeEmail } from "@/lib/substack";

// Back a topic — either an existing idea (ideaId) or a brand-new one
// (newTopic). Minimum backing is $3.
//
// With Stripe configured (STRIPE_SECRET_KEY set), this creates a Checkout
// session and the webhook records the paid backing. Without it — launch
// mode — the backing is recorded directly as an unpaid pledge, which RLS
// permits; 'paid' rows can only ever be written by the webhook.

const CATEGORIES = new Set([
  "ai",
  "biomed",
  "markets",
  "supply-chain",
  "science",
  "math",
  "other",
]);

const MIN_CENTS = 300; // $3
const MAX_CENTS = 100000; // $1,000

export async function POST(req: NextRequest) {
  let body: {
    ideaId?: string;
    newTopic?: {
      title?: string;
      detail?: string;
      link?: string;
      category?: string;
      customCategory?: string;
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
      { error: "Backing must be between $3 and $1,000." },
      { status: 400 }
    );
  }

  const supabase = publicClient();

  // Resolve the idea: existing one, or create a new public topic.
  let idea: { id: string; title: string; status: string } | null = null;

  if (body.newTopic) {
    const title = (body.newTopic.title ?? "").trim();
    const detail = (body.newTopic.detail ?? "").trim();
    const link = (body.newTopic.link ?? "").trim();
    const category = CATEGORIES.has(body.newTopic.category ?? "")
      ? (body.newTopic.category as string)
      : "other";
    const customCategory =
      category === "other"
        ? (body.newTopic.customCategory ?? "").trim().slice(0, 80) || null
        : null;
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
    if (link.length > 500 || detail.length > 1000) {
      return NextResponse.json({ error: "Too long." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("fi_ideas")
      .insert({
        title,
        detail: detail || null,
        link: link || null,
        category,
        custom_category: customCategory,
      })
      .select("id, title, status")
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: "Could not create the topic. Try again." },
        { status: 500 }
      );
    }
    idea = data;
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
    idea = data;
  }

  // Capture email (Supabase + best-effort Substack) — never blocks the flow.
  if (email) void captureEmail(email, "back");

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
              name: `Back: ${idea.title}`,
              description: "Funds coverage of this topic on The Board.",
            },
          },
        },
      ],
      metadata: {
        idea_id: idea.id,
        backer_name: name,
        backer_email: email ?? "",
        is_commission: "0",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#board`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Launch mode: record a pledge (RLS only allows status='pledged' here).
  const { error: pledgeErr } = await supabase.from("fi_backings").insert({
    idea_id: idea.id,
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
  return NextResponse.json({ pledged: true, ideaId: idea.id });
}
