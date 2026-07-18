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

// build an SVG sine path across a viewBox
function sinePath(w: number, h: number, amp: number, cycles: number, phase = 0) {
  const mid = h / 2;
  const steps = 120;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = mid + amp * Math.sin((i / steps) * cycles * Math.PI * 2 + phase);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

function HubInner({ latestBriefId }: { latestBriefId: string | null }) {
  const { ideas, openBackNew } = useMarket();
  const [showBoard, setShowBoard] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const ranked = ideas
    .filter((i) => i.status === "open")
    .sort((a, b) => b.total_cents - a.total_cents);
  const feature = ranked.slice(0, 4);

  return (
    <>
      {/* technical strip */}
      <div className="tstrip">
        <span>// RESEARCH · WRITING · BRIEFS</span>
        <span className="tstrip-mid" />
        <span>FIG. 01 — EST. 2024</span>
      </div>

      {/* hero */}
      <div className="mo-wrap">
        <section className="mo-hero">
          <div>
            <div className="mo-eyebrow">
              // A functional intelligence publication
            </div>
            <h1 className="mo-h1">
              Hard ideas,
              <br />
              made <span className="dim">legible.</span>
            </h1>
            <p className="mo-lede">
              A weekly brief that breaks one genuinely hard topic down to its
              underlying assumptions — every Tuesday, 7am ET. Fund a topic, or
              put our writing under your name.
            </p>
            <div className="mo-hero-tags">
              <span>Free</span>
              <span>Every Tuesday · 7am ET</span>
              <span>Reader-funded</span>
            </div>
            <div className="mo-hero-cta">
              <Link href="/briefs" className="btn-blk">
                Read the brief →
              </Link>
              <button type="button" className="btn-ghost" onClick={openBackNew}>
                Fund a topic
              </button>
            </div>
          </div>

          <div className="mo-diagram" aria-hidden="true">
            <svg viewBox="0 0 520 250" fill="none">
              <line
                x1="0"
                y1="125"
                x2="520"
                y2="125"
                stroke="var(--line)"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
              <path
                d={sinePath(520, 250, 78, 3.2, 0)}
                stroke="var(--line)"
                strokeWidth="1.5"
              />
              <path
                d={sinePath(520, 250, 52, 5.1, 1.1)}
                stroke="var(--line)"
                strokeWidth="1"
                opacity="0.55"
              />
              <path
                d={sinePath(520, 250, 30, 8.3, 2.2)}
                stroke="var(--line)"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* feature cards on a shared axis */}
      <div className="mo-wrap">
        <section className="mo-features">
          <div className="mo-features-head">
            <span>// Sections</span>
            <span>03 / Modules</span>
          </div>
          <div className="mo-axis" />
          <div className="mo-cards">
            <article className="mo-card">
              <div className="mo-card-idx">01</div>
              <h3 className="mo-card-h">Writing Services</h3>
              <p className="mo-card-desc">
                Well-researched content, written in your voice and published
                under your name. Our involvement stays private.
              </p>
              <div className="mo-card-foot">
                <Link href="/services" className="mo-link">
                  About + samples →
                </Link>
              </div>
            </article>

            <article className="mo-card">
              <div className="mo-card-idx">02</div>
              <h3 className="mo-card-h">Research Marketplace</h3>
              <p className="mo-card-desc">
                Back a topic — $5, or name your amount. The highest-backed topic
                becomes the subject of our next brief.
              </p>
              <div className="mo-card-foot">
                <button type="button" className="mo-link" onClick={openBackNew}>
                  Back a topic →
                </button>
                <button
                  type="button"
                  className="mo-chip"
                  onClick={() => setShowBoard(true)}
                >
                  Current board
                </button>
              </div>
            </article>

            <article className="mo-card">
              <div className="mo-card-idx">03</div>
              <h3 className="mo-card-h">Briefs</h3>
              <p className="mo-card-desc">
                A weekly brief that breaks difficult concepts down for clear
                understanding. Every Tuesday, 7am ET — free.
              </p>
              <MiniCountdown />
              <div className="mo-card-foot">
                <Link
                  href={latestBriefId ? `/briefs/${latestBriefId}` : "/briefs"}
                  className="mo-link"
                >
                  Read latest →
                </Link>
                <button
                  type="button"
                  className="mo-chip"
                  onClick={() => setShowSub(true)}
                >
                  Subscribe
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      {/* dark blueprint board section */}
      <section className="mo-dark">
        <div className="mo-wrap">
          <div className="mo-dark-eyebrow">02 / The board</div>
          <h2 className="mo-dark-h">Ideas on the table.</h2>
          <p className="mo-dark-lede">
            Every issue starts as a topic on the funding list. Back what you
            want explained — the most-backed topic ships next. Read-only preview
            of what the board is funding right now.
          </p>
          <div className="mo-bp-grid">
            {feature.length > 0
              ? feature.map((idea, i) => (
                  <div className="mo-bp" key={idea.id}>
                    <BpDiagram i={i} />
                    <div className="mo-bp-cap">
                      {String(i + 1).padStart(2, "0")} ·{" "}
                      {idea.total_cents > 0
                        ? formatMoney(idea.total_cents)
                        : "Open"}
                      <br />
                      {idea.title.length > 46
                        ? idea.title.slice(0, 44) + "…"
                        : idea.title}
                    </div>
                  </div>
                ))
              : [0, 1, 2, 3].map((i) => (
                  <div className="mo-bp" key={i}>
                    <BpDiagram i={i} />
                    <div className="mo-bp-cap">
                      {String(i + 1).padStart(2, "0")} · Open
                      <br />
                      Awaiting the first backer
                    </div>
                  </div>
                ))}
          </div>
          <div className="mo-hero-cta" style={{ marginTop: 32 }}>
            <button type="button" className="btn-blk" onClick={openBackNew}>
              Back a topic →
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowBoard(true)}
              style={{ color: "var(--on-dark)", borderColor: "var(--on-dark)" }}
            >
              View full board
            </button>
          </div>
        </div>
      </section>

      {showBoard && (
        <CurrentBoardModal ideas={ideas} onClose={() => setShowBoard(false)} />
      )}
      {showSub && <SubscribeModal onClose={() => setShowSub(false)} />}
    </>
  );
}

function BpDiagram({ i }: { i: number }) {
  const stroke = "var(--blue-soft)";
  const common = { stroke, fill: "none", strokeWidth: 1.3 } as const;
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true">
      {i % 4 === 0 && (
        <>
          <rect x="46" y="26" width="28" height="28" {...common} />
          <line x1="60" y1="8" x2="60" y2="72" {...common} strokeWidth={0.7} />
          <line x1="16" y1="40" x2="104" y2="40" {...common} strokeWidth={0.7} />
        </>
      )}
      {i % 4 === 1 && (
        <>
          <circle cx="60" cy="40" r="10" {...common} />
          <circle cx="60" cy="40" r="20" {...common} strokeWidth={0.8} />
          <circle cx="60" cy="40" r="30" {...common} strokeWidth={0.6} />
        </>
      )}
      {i % 4 === 2 && (
        <>
          <rect x="26" y="46" width="10" height="20" {...common} />
          <rect x="44" y="34" width="10" height="32" {...common} />
          <rect x="62" y="24" width="10" height="42" {...common} />
          <rect x="80" y="40" width="10" height="26" {...common} />
        </>
      )}
      {i % 4 === 3 && (
        <path
          d="M14 60 L34 44 L52 52 L70 26 L88 36 L106 18"
          {...common}
        />
      )}
    </svg>
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
    return <div className="mo-count">Next brief · Tuesday, 7am ET</div>;
  }
  const p = countdownParts(nextBrief(now).getTime() - now.getTime());
  return (
    <div className="mo-count" suppressHydrationWarning>
      Next brief in{" "}
      <b>
        {p.days}d {String(p.hours).padStart(2, "0")}h{" "}
        {String(p.minutes).padStart(2, "0")}m
      </b>
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
              <span className="board-rank">
                {String(idx + 1).padStart(2, "0")}
              </span>
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
