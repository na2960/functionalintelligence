import Link from "next/link";

const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-links">
          <span className="footer-brand">ƒi — Functional Intelligence</span>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refunds">Refunds</Link>
          {SUBSTACK_URL ? (
            <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
              Substack
            </a>
          ) : null}
        </div>
        <p className="fine">
          Backing is a voluntary, non-refundable payment to prioritize which
          topic gets covered. It is not a wager, bet, or entry in a game of
          chance, and it carries no odds, no payouts, and no financial,
          ownership, or other return of any kind. Funding a topic does not
          guarantee any specific result or publication date. Every brief is free
          to read. Functional Intelligence is an editorial publication, not a
          financial product or investment.
        </p>
      </div>
    </footer>
  );
}
