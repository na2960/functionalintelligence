import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Terms of Service — Functional Intelligence",
};

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="July 13, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of Functional Intelligence (&ldquo;ƒi&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;), including the website at
        funcimarket.com, The Board, briefs, and related services (together, the
        &ldquo;Service&rdquo;). By using the Service you agree to these Terms.
        If you do not agree, do not use the Service.
      </p>

      <h2>1. What Functional Intelligence is</h2>
      <p>
        Functional Intelligence is an editorial publication. Readers submit
        research papers, topics, and questions to a public list called The
        Board and may make voluntary payments to prioritize which topic we
        cover next. The single most-funded topic when a market closes is
        published as a short explanatory brief. The Service is a way to
        prioritize and commission editorial content. It is not a financial
        product, security, investment, deposit, wager, lottery, or game of
        chance.
      </p>

      <h2>2. Payments: backing and commissions</h2>
      <ul>
        <li>
          <strong>Backing</strong> is a voluntary payment that adds to a
          topic&rsquo;s total to help it rank higher on The Board. Multiple
          people may back the same topic; totals are cumulative.
        </li>
        <li>
          <strong>Commissions</strong> are voluntary payments (from $100) to
          have a private brief written on a topic of your choice, delivered to
          you first. A commissioned brief remains private unless you choose to
          release it.
        </li>
        <li>
          All payments are <strong>voluntary and non-refundable</strong> except
          as described in our{" "}
          <a href="/refunds">Refund Policy</a>. Payments confer no odds, no
          payouts, and no financial, ownership, equity, or other return of any
          kind.
        </li>
        <li>
          Funding a topic does <strong>not guarantee</strong> that it will be
          covered, nor any particular result, quality, length, accuracy, or
          publication date. Editorial decisions are ours.
        </li>
      </ul>

      <h2>3. How The Board works</h2>
      <p>
        Each market closes at 8:00 PM ET the night before an issue (Monday and
        Wednesday). When a market closes, the topic with the highest total
        funding is selected to be published as a brief, typically on the
        following Tuesday or Thursday. Topics that are not selected keep their
        funding and remain on The Board until covered, removed, or superseded.
        We may adjust the schedule, mechanics, or selection at our discretion.
      </p>

      <h2>4. Your submissions</h2>
      <p>
        When you submit a topic, question, link, or other content, you
        represent that you have the right to do so and that it does not violate
        any law or third-party right. Do not submit confidential, proprietary,
        personal, or export-controlled information you are not free to share.
        You grant us a worldwide, royalty-free license to use, reproduce, and
        create editorial works based on your submission. We may decline, edit,
        or remove any submission for any reason. Publicly displayed backer names
        are optional and provided by you.
      </p>

      <h2>5. Not professional advice</h2>
      <p>
        Briefs are general educational and journalistic content. They are not,
        and must not be relied upon as, financial, investment, legal, medical,
        scientific, or other professional advice. Always consult a qualified
        professional before acting on any topic covered.
      </p>

      <h2>6. Acceptable use</h2>
      <p>
        You agree not to misuse the Service, including by attempting to gain
        unauthorized access, disrupting the Service, scraping at scale,
        submitting unlawful or infringing content, or using the Service to
        launder money or evade payment-processor rules. We may suspend or
        terminate access for any violation.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The Service, briefs, and all related content are owned by Functional
        Intelligence or its licensors and are protected by intellectual-property
        laws. Briefs are free to read; you may share links but may not
        republish, resell, or create derivative works without permission.
      </p>

      <h2>8. Third-party services</h2>
      <p>
        Payments are processed by Stripe, Inc. and are subject to Stripe&rsquo;s
        terms; we do not receive or store your full card details. We use
        Supabase for data storage. Your use of the Service is also subject to
        those providers&rsquo; terms and privacy practices. See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, express or implied,
        including merchantability, fitness for a particular purpose, accuracy,
        and non-infringement. We do not warrant that the Service will be
        uninterrupted, error-free, or that any topic will be covered.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Functional Intelligence and its
        operators will not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or for any loss of profits or data,
        arising from your use of the Service. Our total liability for any claim
        relating to the Service will not exceed the greater of the amount you
        paid us in the three months before the claim or fifty U.S. dollars
        ($50).
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Functional Intelligence and its
        operators from any claims, damages, and expenses arising out of your
        submissions, your use of the Service, or your violation of these Terms.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        reflected by updating the &ldquo;Last updated&rdquo; date above.
        Continued use after changes constitutes acceptance.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of New York and
        applicable U.S. federal law, without regard to conflict-of-laws rules.
        The exclusive venue for disputes is the state and federal courts located
        in New York, New York.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </LegalLayout>
  );
}
