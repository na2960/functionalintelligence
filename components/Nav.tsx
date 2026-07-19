import Link from "next/link";

type Active = "services" | "about" | "marketplace" | "contact";

export default function Nav({ active }: { active?: Active }) {
  const cls = (key: Active) => `nav-link${active === key ? " on" : ""}`;
  // An active tab links back home, so clicking it again returns to "/".
  const href = (key: Active, path: string) => (active === key ? "/" : path);
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
          <Link href={href("services", "/services")} className={cls("services")}>
            Writing Services
          </Link>
          <Link href={href("about", "/about")} className={cls("about")}>
            About
          </Link>
          <Link
            href={href("marketplace", "/briefs")}
            className={cls("marketplace")}
          >
            Research Marketplace
          </Link>
          <Link href={href("contact", "/contact")} className={cls("contact")}>
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
