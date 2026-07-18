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
      </div>
    </footer>
  );
}
