import Link from "next/link";
import Countdown from "./Countdown";

export default function Nav({ active }: { active?: "briefs" }) {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand-link">
          <span className="mark">
            <em>f</em> i
          </span>
          <span className="masthead">
            <span className="name">Functional Intelligence</span>
          </span>
        </Link>
        <div className="spacer" />
        <Countdown />
        <Link
          href="/briefs"
          className={`nav-cta ghost${active === "briefs" ? " on" : ""}`}
        >
          Briefs
        </Link>
        <Link className="nav-cta solid" href="/#founder-voice">
          Work with us
        </Link>
      </div>
    </nav>
  );
}
