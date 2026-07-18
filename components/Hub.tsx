"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BoardIdea } from "@/lib/supabase";
import { nextBrief, countdownParts, formatMoney } from "@/lib/market";
import MarketProvider, { useMarket } from "./MarketProvider";
import Modal from "./Modal";
import EmailCapture from "./EmailCapture";

export default function Hub({
  board,
  latestBriefId,
}: {
  board: BoardIdea[];
  latestBriefId: string | null;
}) {
  return (
    <MarketProvider initialIdeas={board}>
      <HubInner latestBriefId={latestBriefId} />
    </MarketProvider>
  );
}

function HubInner({ latestBriefId }: { latestBriefId: string | null }) {
  const { ideas, openBackNew } = useMarket();
  const [showBoard, setShowBoard] = useState(false);
  const [showSub, setShowSub] = useState(false);

  return (
    <main className="hub-wrap">
      <div className="hub">
        <section className="hub-box hub-writing">
          <div className="hub-kicker">Writing Services</div>
          <h2 className="hub-title">Founder Voice</h2>
          <p className="hub-body">
            Well-researched content, written in your voice and published under
            your name. Our involvement stays private.
          </p>
          <Link href="/services" className="hub-link">
            About, with writing samples →
          </Link>
        </section>

        <span className="hub-join hub-join-v" aria-hidden="true" />

        <section className="hub-box hub-briefs">
          <div className="hub-kicker">Briefs</div>
          <h2 className="hub-title">The Weekly Brief</h2>
          <p className="hub-body">
            A weekly brief that breaks down difficult concepts for clear
            understanding — every Tuesday at 7am ET, free.
          </p>
          <MiniCountdown />
          <div className="hub-actions">
            <Link
              href={latestBriefId ? `/briefs/${latestBriefId}` : "/briefs"}
              className="hub-link"
            >
              Most recent brief →
            </Link>
            <button
              type="button"
              className="hub-link as-btn"
              onClick={() => setShowSub(true)}
            >
              Subscribe →
            </button>
          </div>
          <button
            type="button"
            className="hub-board-chip"
            onClick={() => setShowBoard(true)}
          >
            Current board
          </button>
        </section>

        <span className="hub-join hub-join-h" aria-hidden="true" />

        <section id="marketplace" className="hub-box hub-market">
          <div className="hub-kicker">The Research Marketplace</div>
          <h2 className="hub-title hub-title-lg">
            Hard ideas,
            <br />
            made legible.
          </h2>
          <p className="hub-body">
            Back a topic of your choice — $5, or name your amount. The
            highest-backed topic becomes the subject of our next brief.
          </p>
          <div className="hub-actions">
            <button type="button" className="hub-btn" onClick={openBackNew}>
              Back a topic
            </button>
            <button
              type="button"
              className="hub-board-chip"
              onClick={() => setShowBoard(true)}
            >
              Current board
            </button>
          </div>
        </section>
      </div>

      {showBoard && (
        <CurrentBoardModal ideas={ideas} onClose={() => setShowBoard(false)} />
      )}
      {showSub && <SubscribeModal onClose={() => setShowSub(false)} />}
    </main>
  );
}

function MiniCountdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return <div className="hub-count">Next brief · Tuesday, 7am ET</div>;
  }
  const p = countdownParts(nextBrief(now).getTime() - now.getTime());
  return (
    <div className="hub-count" suppressHydrationWarning>
      <span className="hub-count-label">Next brief in</span>{" "}
      <span className="hub-count-val">
        {p.days}d {String(p.hours).padStart(2, "0")}h{" "}
        {String(p.minutes).padStart(2, "0")}m
      </span>
    </div>
  );
}

function CurrentBoardModal({
  ideas,
  onClose,
}: {
  ideas: BoardIdea[];
  onClose: () => void;
}) {
  const open = ideas
    .filter((i) => i.status === "open")
    .sort((a, b) => b.total_cents - a.total_cents);

  return (
    <Modal
      title="Current board"
      subtitle="Topics on the table, ranked by backing. Read-only."
      onClose={onClose}
    >
      {open.length === 0 ? (
        <p className="board-empty">No topics on the board yet.</p>
      ) : (
        <ol className="board-list">
          {open.map((i, idx) => (
            <li key={i.id} className="board-row">
              <span className="board-rank">{idx + 1}</span>
              <span className="board-topic">{i.title}</span>
              <span className="board-amt">
                {i.total_cents > 0 ? formatMoney(i.total_cents) : "—"}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="board-foot">
        The highest-backed topic becomes the subject of our next brief.
      </p>
    </Modal>
  );
}

function SubscribeModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Subscribe to the brief"
      subtitle="Every Tuesday at 7am ET. Always free."
      onClose={onClose}
    >
      <div className="sub-modal">
        <EmailCapture variant="band" cta="Sign up — free" />
      </div>
    </Modal>
  );
}
