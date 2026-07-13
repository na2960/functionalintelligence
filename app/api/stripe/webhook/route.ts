import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { recordPaidSession } from "@/lib/fulfill";

// Stripe webhook: records paid backings. Requires STRIPE_SECRET_KEY,
// STRIPE_WEBHOOK_SECRET, and SUPABASE_SERVICE_ROLE_KEY in the environment.
// Configure the Stripe endpoint as POST https://<domain>/api/stripe/webhook
// (no trailing slash) listening for `checkout.session.completed`.
//
// Fulfillment also happens on the /success page, so a payment still records
// even if this webhook is momentarily misconfigured — both paths are idempotent.

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const result = await recordPaidSession(event.data.object);
    if (!result.ok) {
      // Non-2xx makes Stripe retry, so a transient DB failure self-heals.
      return NextResponse.json({ error: "db error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
