import Link from "next/link";

const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim();

export default function Nav({ active }: { active?: "board" | "briefs" }) {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand-link">
          <span className="mark">
            <em>f</em> i
          </span>
          <span className="masthead">
            <span className="name">Functional Intelligence</span>
            <span className="status">
              <span className="dot" />
              MARKET OPEN
            </span>
          </span>
        </Link>
        <div className="tabs">
          <Link href="/" className={`tab${active === "board" ? " on" : ""}`}>
            The Board
          </Link>
          <Link
            href="/briefs"
            className={`tab${active === "briefs" ? " on" : ""}`}
          >
            Briefs
          </Link>
        </div>
        <div className="spacer" />
        {SUBSTACK_URL ? (
          <a
            className="nav-cta ghost"
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Substack ↗
          </a>
        ) : null}
        <Link className="nav-cta solid" href="/#board">
          Fund an idea
        </Link>
      </div>
    </nav>
  );
}
