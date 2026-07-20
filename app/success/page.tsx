import Link from "next/link";
import Stripe from "stripe";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { recordPaidSession } from "@/lib/fulfill";
import { formatMoney } from "@/lib/market";

export const dynamic = "force-dynamic";

const CONTACT =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; retainer?: string }>;
}) {
  const { session_id, retainer } = await searchParams;
  const isRetainer = retainer === "founder_voice" || retainer === "founder_voice_plus";
  const tierName =
    retainer === "founder_voice_plus" ? "Custom Blueprint+" : "Custom Blueprint";

  let paid = false;
  let amount: number | null = null;
  const key = process.env.STRIPE_SECRET_KEY;

  // Fallback fulfillment for topic backings: record here too, so it lands even
  // if the webhook is misconfigured. Idempotent via stripe_session_id.
  // (Subscription/retainer sessions have no idea_id, so recordPaidSession is a
  // no-op for them — the subscription itself is managed by Stripe.)
  if (key && session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const stripe = new Stripe(key);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid" || session.status === "complete") {
        paid = true;
        amount = session.amount_total ?? null;
        if (!isRetainer) await recordPaidSession(session);
      }
    } catch {
      // If retrieval fails, the webhook remains the backstop.
    }
  }

  return (
    <>
      <Nav />
      <div className="frame">
        <section className="frame-sec success-sec">
          <div className="success-badge">✓</div>
          {isRetainer ? (
            <>
              <h1>Welcome to {tierName}.</h1>
              <p>
                Your retainer is active. We&rsquo;ll email you within one
                business day to schedule your kick-off call and get familiar
                with your data model or problem. Questions any time:{" "}
                <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
              </p>
            </>
          ) : (
            <>
              <h1>You&rsquo;re on the list.</h1>
              <p>
                {paid && amount
                  ? `Your ${formatMoney(amount)} backing is in and counts toward the topic right now. `
                  : "Your backing is in. "}
                The most-backed topic becomes next Tuesday&rsquo;s brief, at 7:00
                AM ET.
              </p>
            </>
          )}
          <div className="success-actions">
            <Link className="btn btn-gold" href="/">
              Back to home →
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
