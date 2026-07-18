import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Marketplace from "@/components/Marketplace";
import SubscribeButton, { BriefTimer } from "@/components/SubscribeButton";
import {
  fetchBriefs,
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
    "Back the topic you want explained, read the current issue, browse the archive, and subscribe. Reader-funded briefs, free to read.",
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
  let briefs: Brief[] = [];
  let latest: Brief | null = null;
  let board: BoardIdea[] = [];
  try {
    briefs = await fetchBriefs();
  } catch {}
  try {
    latest = await fetchLatestBrief();
  } catch {}
  try {
    board = await fetchBoard();
  } catch {}

  const archive = latest ? briefs.filter((b) => b.id !== latest!.id) : briefs;

  return (
    <>
      <Nav active="marketplace" />

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Reader-funded research</div>
          <h1 className="mo-h1">
            Research
            <br />
            Marketplace.
          </h1>
          <p className="mo-lede">
            Back the topic you want explained. The most-backed idea becomes next
            week&rsquo;s brief — free to read.
          </p>
          <div className="mkt-head-actions">
            <BriefTimer />
            <SubscribeButton />
          </div>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* current issue */}
      <div className="mo-wrap">
        <section className="mkt-current">
          <div className="mo-features-head">
            <span>// Current issue</span>
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
                The board decides what it is. Back a topic below to help set the
                agenda.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* fund your own + board */}
      <Marketplace board={board} />

      {/* archive */}
      <div className="mo-wrap">
        <section className="mkt-archive">
          <div className="mo-features-head">
            <span>// Archive</span>
            <span>{String(archive.length).padStart(2, "0")} briefs</span>
          </div>
          <div className="mo-axis" />
          {archive.length === 0 ? (
            <p className="board-empty">No past issues yet — the archive fills up weekly.</p>
          ) : (
            <ul className="mkt-arch-list">
              {archive.map((b, i) => (
                <li key={b.id}>
                  <Link href={`/briefs/${b.id}`} className="mkt-arch-row">
                    <span className="board-rank">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mkt-arch-tag mono">
                      {CATEGORY_LABELS[b.category] ?? b.category}
                    </span>
                    <span className="mkt-arch-title">{b.title}</span>
                    <span className="mkt-arch-when mono">
                      {fmtDate(b.covered_at)}
                    </span>
                    <span className="mo-link">Read →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
