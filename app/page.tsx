import About from "@/components/About";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import FounderVoice from "@/components/FounderVoice";
import FundTopic from "@/components/FundTopic";
import LatestBrief from "@/components/LatestBrief";
import MarketProvider from "@/components/MarketProvider";
import Nav from "@/components/Nav";
import {
  fetchBoard,
  fetchLatestBrief,
  type BoardIdea,
  type Brief,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch independently so one failing query can't blank the other.
  let board: BoardIdea[] = [];
  let latest: Brief | null = null;
  try {
    board = await fetchBoard();
  } catch {
    // topic list falls back to empty; client refreshes
  }
  try {
    latest = await fetchLatestBrief();
  } catch {
    // no latest brief yet
  }

  return (
    <>
      <Nav />

      <div className="frame">
        <section className="frame-sec hero2">
          <h1 className="hero-h1">Hard ideas, made legible.</h1>
          <p className="hero-lede2">You fund it. We break it down.</p>
          <p className="hero-desc">
            Every Tuesday at 7am, we take one genuinely difficult topic — a
            paper, a method, a claim — and break it down to its underlying
            assumptions in a five-minute brief anyone can follow. Free to read,
            always.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-gold" href="/briefs">
              Read the briefs →
            </a>
            <a className="btn btn-secondary" href="#fund">
              Fund a topic →
            </a>
          </div>
        </section>

        <LatestBrief brief={latest} />

        <MarketProvider initialIdeas={board}>
          <section id="fund" className="frame-sec">
            <div className="section-head">
              <h2>Fund a topic</h2>
            </div>
            <FundTopic />
          </section>
        </MarketProvider>

        <section className="frame-sec subscribe-sec">
          <div className="subscribe-inner">
            <div>
              <h2>Get the brief free, every Tuesday.</h2>
              <p>One email a week — the week&rsquo;s brief, in your inbox at 7am ET.</p>
            </div>
            <EmailCapture variant="band" />
          </div>
        </section>

        <FounderVoice />

        <About />
      </div>

      <Footer />
    </>
  );
}
