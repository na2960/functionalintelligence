import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { serviceClient } from "@/lib/supabase";

// Stripe webhook: records paid backings. Requires STRIPE_SECRET_KEY,
// STRIPE_WEBHOOK_SECRET, and SUPABASE_SERVICE_ROLE_KEY in the environment.
// Point Stripe at POST /api/stripe/webhook with the
// `checkout.session.completed` event.

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = serviceClient();

  if (!stripeKey || !webhookSecret || !supabase) {
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
    const session = event.data.object;
    const ideaId = session.metadata?.idea_id;
    const amount = session.amount_total;

    if (ideaId && amount && session.payment_status === "paid") {
      // Upsert on session id makes webhook retries idempotent.
      const email =
        session.metadata?.backer_email ||
        session.customer_details?.email ||
        null;
      const { error } = await supabase.from("fi_backings").upsert(
        {
          idea_id: ideaId,
          amount_cents: amount,
          status: "paid",
          backer_name: session.metadata?.backer_name || null,
          backer_email: email,
          is_commission: session.metadata?.is_commission === "1",
          stripe_session_id: session.id,
        },
        { onConflict: "stripe_session_id", ignoreDuplicates: true }
      );
      if (error) {
        // Non-2xx makes Stripe retry, so a transient DB failure self-heals.
        return NextResponse.json({ error: "db error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
