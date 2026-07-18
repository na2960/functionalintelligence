import Link from "next/link";

type Active = "services" | "about" | "marketplace" | "briefs";

const CONTACT =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";

export default function Nav({ active }: { active?: Active }) {
  const cls = (key: Active) => `nav-link${active === key ? " on" : ""}`;
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
        <div className="nav-links">
          <Link href="/services" className={cls("services")}>
            Writing Services
          </Link>
          <Link href="/about" className={cls("about")}>
            About
          </Link>
          <Link href="/#marketplace" className={cls("marketplace")}>
            Research Marketplace
          </Link>
          <a href={`mailto:${CONTACT}`} className="nav-link">
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
