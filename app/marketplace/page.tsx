import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MarketBoard from "@/components/MarketBoard";

export const metadata = {
  title: "Markets — Functional Intelligence",
  description:
    "Live markets across the sectors we interface with — energy, power, renewables, and the materials supply chain. Auto-updating.",
};

export default function MarketsPage() {
  return (
    <>
      <Nav active="marketplace" />

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Live markets</div>
          <h1 className="mo-h1">Markets.</h1>
          <p className="mo-lede">
            The sectors we interface with, live — energy, power, renewables, and
            the materials supply chain. Auto-updating on the page.
          </p>
        </section>
      </div>

      <div className="mo-ruler" />

      <MarketBoard />

      <Footer />
    </>
  );
}
