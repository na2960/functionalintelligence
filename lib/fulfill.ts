import type Stripe from "stripe";
import { serviceClient } from "@/lib/supabase";

// Single source of truth for turning a paid Stripe Checkout Session into a
// 'paid' backing row. Called from BOTH the webhook and the /success page so a
// payment is recorded even if the webhook endpoint is misconfigured or the
// event is delayed. Idempotent: the unique stripe_session_id + ignoreDuplicates
// upsert means calling it many times for the same session is safe.
export async function recordPaidSession(
  session: Stripe.Checkout.Session
): Promise<{ ok: boolean; recorded: boolean; error?: string }> {
  const supabase = serviceClient();
  if (!supabase) return { ok: false, recorded: false, error: "not configured" };

  const ideaId = session.metadata?.idea_id;
  const amount = session.amount_total;
  if (!ideaId || !amount || session.payment_status !== "paid") {
    return { ok: true, recorded: false };
  }

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
  if (error) return { ok: false, recorded: false, error: error.message };
  return { ok: true, recorded: true };
}
