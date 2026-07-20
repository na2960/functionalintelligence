import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { RETAINERS, type RetainerTier } from "@/lib/retainer";
import { normalizeEmail } from "@/lib/substack";

// Start a Research Services retainer (Custom Blueprint / Custom Blueprint+):
// creates a subscription-mode Stripe Checkout session for the chosen tier.
// Requires STRIPE_SECRET_KEY.
export async function POST(req: NextRequest) {
  let body: { tier?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const tier = body.tier as RetainerTier;
  if (tier !== "founder_voice" && tier !== "founder_voice_plus") {
    return NextResponse.json({ error: "invalid tier" }, { status: 400 });
  }
  const email = normalizeEmail(body.email);

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Subscriptions aren't enabled yet — email us instead." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const origin =
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "localhost:3000"}`;

  // Resolve the product's current price. Prefer the default price; fall back
  // to the newest active recurring price on the product.
  const productId = RETAINERS[tier].product;
  let priceId: string | null = null;
  try {
    const product = await stripe.products.retrieve(productId);
    priceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price?.id ?? null;
    if (!priceId) {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: "recurring",
        limit: 1,
      });
      priceId = prices.data[0]?.id ?? null;
    }
  } catch {
    priceId = null;
  }
  if (!priceId) {
    return NextResponse.json(
      { error: "This plan isn't available right now — email us instead." },
      { status: 503 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...(email ? { customer_email: email } : {}),
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { tier },
    success_url: `${origin}/success?retainer=${tier}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/services`,
  });
  return NextResponse.json({ url: session.url });
}
