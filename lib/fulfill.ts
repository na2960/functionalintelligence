import type Stripe from "stripe";
import { serviceClient } from "@/lib/supabase";

// Single source of truth for turning a paid Stripe Checkout Session into a
// 'paid' backing row. Called from BOTH the webhook and the /success page so a
// payment is recorded even if the webhook endpoint is misconfigured or the
// event is delayed. Idempotent: the unique stripe_session_id + ignoreDuplicates
// upsert means calling it many times for the same session is safe.
//
// New topics are created here, only on a paid session — a cancelled checkout
// never leaves an unpaid topic on the board.
export async function recordPaidSession(
  session: Stripe.Checkout.Session
): Promise<{ ok: boolean; recorded: boolean; error?: string }> {
  const supabase = serviceClient();
  if (!supabase) return { ok: false, recorded: false, error: "not configured" };

  let ideaId = session.metadata?.idea_id || "";
  const newTitle = session.metadata?.new_title || "";
  const amount = session.amount_total;
  if ((!ideaId && !newTitle) || !amount || session.payment_status !== "paid") {
    return { ok: true, recorded: false };
  }

  // If this session backed a brand-new topic, create it now — but reuse an
  // existing idea if this session was already fulfilled (webhook + /success).
  if (!ideaId && newTitle) {
    const { data: prior } = await supabase
      .from("fi_backings")
      .select("idea_id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();
    if (prior?.idea_id) {
      ideaId = prior.idea_id;
    } else {
      const { data: idea, error: ideaErr } = await supabase
        .from("fi_ideas")
        .insert({
          title: newTitle,
          link: session.metadata?.new_link || null,
          category: "other",
        })
        .select("id")
        .single();
      if (ideaErr || !idea) {
        return {
          ok: false,
          recorded: false,
          error: ideaErr?.message ?? "could not create topic",
        };
      }
      ideaId = idea.id;
    }
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
