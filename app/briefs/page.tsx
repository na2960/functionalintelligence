import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Marketplace from "@/components/Marketplace";
import SubscribeButton, { BriefTimer } from "@/components/SubscribeButton";
import {
  fetchLatestBrief,
  fetchBoard,
  type Brief,
  type BoardIdea,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  biomed: "Biomedicine",
  markets: "Markets",
  "supply-chain": "Supply Chain",
  science: "Science",
  math: "Math",
  other: "Other",
};

export const metadata = {
  title: "Research Marketplace — Functional Intelligence",
  description:
    "Back any topic you want explained, read the current issue, and subscribe. Reader-funded briefs, free to read.",
};

function fmtDate(d: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
}

export default async function Marketplace_Page() {
  let latest: Brief | null = null;
  let board: BoardIdea[] = [];
  try {
    latest = await fetchLatestBrief();
  } catch {}
  try {
    board = await fetchBoard();
  } catch {}

  return (
    <>
      <Nav active="marketplace" />

      <div className="mo-wrap">
        <section className="mkt-head mkt-head-2col">
          <div className="mkt-head-main">
            <div className="mo-eyebrow">// Reader-funded research</div>
            <h1 className="mo-h1">
              Research
              <br />
              Marketplace.
            </h1>
            <p className="mo-lede">
              Back any topic you want explained. The most-backed idea becomes
              next week&rsquo;s brief — free to read.
            </p>
            <div className="mkt-head-actions">
              <BriefTimer />
              <SubscribeButton />
            </div>
          </div>
          <nav className="mkt-head-nav">
            <a href="#briefs" className="mo-chip">
              Briefs
            </a>
            <a href="#board" className="mo-chip">
              The Board
            </a>
          </nav>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* current issue */}
      <div className="mo-wrap">
        <section id="briefs" className="mkt-current">
          <div className="mo-features-head">
            <span>// Briefs</span>
            <span>{latest ? fmtDate(latest.covered_at) : "Coming soon"}</span>
          </div>
          <div className="mo-axis" />
          {latest ? (
            <Link href={`/briefs/${latest.id}`} className="mkt-issue">
              <div className="mkt-issue-meta mono">
                <span className="mkt-tag">
                  {CATEGORY_LABELS[latest.category] ?? latest.category}
                </span>
                <span>Latest brief</span>
              </div>
              <h2 className="mkt-issue-h">{latest.title}</h2>
              {latest.detail ? (
                <p className="mo-card-desc">{latest.detail}</p>
              ) : null}
              <span className="mo-link">Read the brief →</span>
            </Link>
          ) : (
            <div className="mkt-issue mkt-issue-empty">
              <h2 className="mkt-issue-h">The first brief ships soon.</h2>
              <p className="mo-card-desc">
                Back a topic below to help set the agenda.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* the board — fund your own */}
      <Marketplace board={board} />

      <Footer />
    </>
  );
}
