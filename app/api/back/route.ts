import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { publicClient } from "@/lib/supabase";

// Backing an idea.
// With Stripe configured (STRIPE_SECRET_KEY set), this creates a Checkout
// session and the webhook records the paid backing. Without it — launch
// mode — the backing is recorded directly as an unpaid pledge, which RLS
// permits; 'paid' rows can only ever be written by the webhook.

export async function POST(req: NextRequest) {
  let body: {
    ideaId?: string;
    amountCents?: number;
    name?: string;
    commission?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const ideaId = body.ideaId ?? "";
  const amountCents = Math.round(Number(body.amountCents));
  const name = (body.name ?? "").trim().slice(0, 60);
  const commission = Boolean(body.commission) && amountCents >= 10000;

  if (!/^[0-9a-f-]{36}$/i.test(ideaId)) {
    return NextResponse.json({ error: "invalid idea" }, { status: 400 });
  }
  if (!Number.isFinite(amountCents) || amountCents < 100 || amountCents > 100000) {
    return NextResponse.json(
      { error: "Backing must be between $1 and $1,000." },
      { status: 400 }
    );
  }

  const supabase = publicClient();
  const { data: idea, error: ideaErr } = await supabase
    .from("fi_ideas")
    .select("id, title, status")
    .eq("id", ideaId)
    .single();

  if (ideaErr || !idea) {
    return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  }
  if (idea.status !== "open") {
    return NextResponse.json(
      { error: "This idea is no longer open for backing." },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    const origin =
      req.headers.get("origin") ??
      `https://${req.headers.get("host") ?? "localhost:3000"}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: commission
                ? `Commission: ${idea.title}`
                : `Back: ${idea.title}`,
              description: commission
                ? "Private commissioned brief — delivered to you first."
                : "Funds coverage of this idea on The Board.",
            },
          },
        },
      ],
      metadata: {
        idea_id: idea.id,
        backer_name: name,
        is_commission: commission ? "1" : "0",
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
    is_commission: commission,
  });

  if (pledgeErr) {
    return NextResponse.json(
      { error: "Could not record the backing. Try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ pledged: true });
}
