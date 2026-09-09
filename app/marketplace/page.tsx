import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProblemMarket from "@/components/ProblemMarket";

export const metadata = {
  title: "Marketplace — Functional Intelligence",
  description:
    "The top-valued, specifically-named problems we work on across finance, energy, and materials design — each solvable with custom physics-AI.",
};

export default function MarketplacePage() {
  return (
    <>
      <Nav active="marketplace" />

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Top-valued problems</div>
          <h1 className="mo-h1">
            Marketplace.
          </h1>
          <p className="mo-lede">
            The specifically-named problems we work on across markets and
            materials — each one high-value, well-defined, and solvable with
            custom physics-AI. See one that&rsquo;s yours? Get in touch.
          </p>
        </section>
      </div>

      <div className="mo-ruler" />

      <ProblemMarket />

      <Footer />
    </>
  );
}
