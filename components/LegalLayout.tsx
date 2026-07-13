import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="frame">
        <article className="frame-sec legal">
          <Link href="/" className="back-link">
            ← Home
          </Link>
          <h1>{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
          {children}
        </article>
      </div>
      <Footer />
    </>
  );
}
