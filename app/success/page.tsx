import Link from "next/link";
import Stripe from "stripe";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { recordPaidSession } from "@/lib/fulfill";
import { formatMoney } from "@/lib/market";

export const dynamic = "force-dynamic";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; commission?: string }>;
}) {
  const { session_id, commission } = await searchParams;
  const isCommission = commission === "1";

  let paid = false;
  let amount: number | null = null;
  const key = process.env.STRIPE_SECRET_KEY;

  // Fallback fulfillment: record the backing here too, so it lands even if the
  // webhook is misconfigured. Idempotent with the webhook via stripe_session_id.
  if (key && session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const stripe = new Stripe(key);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        paid = true;
        amount = session.amount_total ?? null;
        await recordPaidSession(session);
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
          {isCommission ? (
            <>
              <h1>Commission received.</h1>
              <p>
                {paid && amount
                  ? `Your ${formatMoney(amount)} commission is confirmed. `
                  : "Your commission is confirmed. "}
                It&rsquo;s private — we&rsquo;ll write it for you and send it to
                the email you provided before it goes anywhere else.
              </p>
            </>
          ) : (
            <>
              <h1>You&rsquo;re on the board.</h1>
              <p>
                {paid && amount
                  ? `Your ${formatMoney(amount)} backing is in and counts toward the topic right now. `
                  : "Your backing is in. "}
                Watch it climb — the market closes at 8:00 PM ET the night
                before each issue, and the top topic ships Tuesday &amp;
                Thursday at 7:00 AM.
              </p>
            </>
          )}
          <div className="success-actions">
            <Link className="btn btn-gold" href="/#board">
              Back to The Board →
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
