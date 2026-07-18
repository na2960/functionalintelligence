import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import FundTopic from "@/components/FundTopic";
import MarketProvider from "@/components/MarketProvider";
import Nav from "@/components/Nav";
import { fetchBoard, type BoardIdea } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let board: BoardIdea[] = [];
  try {
    board = await fetchBoard();
  } catch {
    // topic list falls back to empty; client refreshes
  }

  return (
    <>
      <Nav />

      <div className="frame">
        <section className="frame-sec ed-hero">
          <h1 className="ed-statement">Hard ideas, made legible.</h1>
          <p className="ed-sub">
            A free weekly brief that breaks one genuinely difficult topic — a
            paper, a method, a claim — down to its underlying assumptions.
            Anyone can follow it. Every Tuesday, 7am ET.
          </p>
          <div className="ed-hero-links">
            <Link href="/briefs">Read the briefs →</Link>
            <a href="#fund">Fund a topic →</a>
          </div>
        </section>

        <section className="frame-sec ed-subscribe">
          <h2 className="ed-title">Subscribe for our briefs</h2>
          <p className="ed-lede">
            Every Tuesday at 7am ET, in your inbox. Always free.
          </p>
          <EmailCapture variant="band" cta="Sign up for the brief — free" />
        </section>

        <MarketProvider initialIdeas={board}>
          <section id="fund" className="frame-sec ed-fund">
            <h2 className="ed-title">Back a topic you want us to cover</h2>
            <p className="ed-lede">
              The most-backed topic becomes next Tuesday&rsquo;s brief.
            </p>
            <FundTopic />
          </section>
        </MarketProvider>

        <section className="frame-sec ed-teaser">
          <h2 className="ed-title">Writing &amp; research services</h2>
          <p className="ed-lede">
            We also write technical content in your voice, published under your
            name — the briefs are our portfolio. Our involvement stays private.
          </p>
          <Link href="/services" className="ed-more">
            See writing &amp; research services →
          </Link>
        </section>
      </div>

      <Footer />
    </>
  );
}
