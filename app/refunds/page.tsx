import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Refund Policy — Functional Intelligence",
};

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";

export default function Refunds() {
  return (
    <LegalLayout title="Refund Policy" updated="July 13, 2026">
      <p>
        Backing a topic and commissioning a brief are voluntary payments that
        prioritize editorial coverage. Because they fund work and queue
        placement immediately, they are <strong>generally non-refundable</strong>.
        Please back and commission deliberately.
      </p>

      <h2>When we will refund</h2>
      <p>At our discretion, we will refund a payment if:</p>
      <ul>
        <li>
          you were charged in error, more than once, or in the wrong amount;
        </li>
        <li>
          the payment did not register on The Board due to a technical failure
          on our side; or
        </li>
        <li>
          you commissioned a private brief and we determine we cannot deliver it
          (in which case the commission amount is refunded).
        </li>
      </ul>

      <h2>When we will not refund</h2>
      <ul>
        <li>
          because your backed topic did not win, was not covered, or was covered
          later than you hoped &mdash; funding prioritizes but never guarantees
          coverage or timing;
        </li>
        <li>
          because you changed your mind after the payment was recorded; or
        </li>
        <li>
          because you disagree with the editorial content, length, or
          conclusions of a brief.
        </li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> within 14 days of the
        charge with the email address used and the approximate date and amount.
        Approved refunds are returned to the original payment method via Stripe
        and typically appear within 5&ndash;10 business days.
      </p>

      <h2>Chargebacks</h2>
      <p>
        If you have an issue with a payment, please contact us first &mdash; we
        can usually resolve it quickly. Initiating a chargeback without
        contacting us may result in suspension of access.
      </p>
    </LegalLayout>
  );
}
