import Link from "next/link";
import Countdown from "./Countdown";

type Active = "briefs" | "services" | "about" | "fund";

export default function Nav({ active }: { active?: Active }) {
  const link = (key: Active) => `nav-link${active === key ? " on" : ""}`;
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand-link">
          <span className="mark">
            <em>f</em> i
          </span>
          <span className="brand-name">Functional Intelligence</span>
        </Link>
        <div className="spacer" />
        <Countdown />
        <div className="nav-links">
          <Link href="/briefs" className={link("briefs")}>
            Briefs
          </Link>
          <Link href="/#fund" className={link("fund")}>
            Fund a topic
          </Link>
          <Link href="/services" className={link("services")}>
            Services
          </Link>
          <Link href="/about" className={link("about")}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
