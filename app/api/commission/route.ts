import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { publicClient } from "@/lib/supabase";
import { captureEmail, normalizeEmail } from "@/lib/substack";

// Commission a private brief. A commission is a single idea funded at $100+
// that is written for and delivered to the commissioner first — it goes
// public only if they choose. The idea is created private (hidden from the
// public board/view) and backed as a commission.

const CATEGORIES = new Set([
  "ai",
  "biomed",
  "markets",
  "supply-chain",
  "science",
  "math",
  "other",
]);

const MIN_CENTS = 10000; // $100
const MAX_CENTS = 100000; // $1,000

export async function POST(req: NextRequest) {
  let body: {
    title?: string;
    detail?: string;
    link?: string;
    category?: string;
    customCategory?: string;
    amountCents?: number;
    name?: string;
    email?: string;
    makePublic?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const detail = (body.detail ?? "").trim();
  const link = (body.link ?? "").trim();
  const category = CATEGORIES.has(body.category ?? "")
    ? (body.category as string)
    : "other";
  const customCategory =
    category === "other"
      ? (body.customCategory ?? "").trim().slice(0, 80) || null
      : null;
  const amountCents = Math.round(Number(body.amountCents));
  const name = (body.name ?? "").trim().slice(0, 60);
  const email = normalizeEmail(body.email);

  if (title.length < 3 || title.length > 140) {
    return NextResponse.json(
      { error: "Topic must be 3–140 characters." },
      { status: 400 }
    );
  }
  if (!email) {
    return NextResponse.json(
      { error: "A valid email is required — that's where your brief goes." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return NextResponse.json(
      { error: "Commissions start at $100 (max $1,000)." },
      { status: 400 }
    );
  }
  if (link && !/^https?:\/\//i.test(link)) {
    return NextResponse.json(
      { error: "Links must start with http(s)://" },
      { status: 400 }
    );
  }

  const supabase = publicClient();
  const { data: idea, error: ideaErr } = await supabase
    .from("fi_ideas")
    .insert({
      title,
      detail: detail || null,
      link: link || null,
      category,
      custom_category: customCategory,
      is_private: true,
      commission_release_consent: Boolean(body.makePublic),
    })
    .select("id, title")
    .single();

  if (ideaErr || !idea) {
    return NextResponse.json(
      { error: "Could not create the commission. Try again." },
      { status: 500 }
    );
  }

  void captureEmail(email, "commission");

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    const origin =
      req.headers.get("origin") ??
      `https://${req.headers.get("host") ?? "localhost:3000"}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Commission: ${idea.title}`,
              description:
                "Private commissioned brief — written for you, delivered first.",
            },
          },
        },
      ],
      metadata: {
        idea_id: idea.id,
        backer_name: name,
        backer_email: email,
        is_commission: "1",
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&commission=1`,
      cancel_url: `${origin}/#board`,
    });
    return NextResponse.json({ url: session.url });
  }

  // Launch mode: record the commission as a pledge.
  const { error: pledgeErr } = await supabase.from("fi_backings").insert({
    idea_id: idea.id,
    amount_cents: amountCents,
    backer_name: name || null,
    backer_email: email,
    is_commission: true,
  });
  if (pledgeErr) {
    return NextResponse.json(
      { error: "Could not record the commission. Try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ pledged: true });
}
