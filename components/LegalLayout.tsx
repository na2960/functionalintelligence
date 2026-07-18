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
      <div className="mo-wrap">
        <section className="mkt-head legal-head">
          <div className="mo-eyebrow">// Legal</div>
          <h1 className="mo-h1 legal-title">{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </section>
      </div>
      <div className="mo-ruler" />
      <div className="mo-wrap">
        <article className="legal">{children}</article>
      </div>
      <Footer />
    </>
  );
}
