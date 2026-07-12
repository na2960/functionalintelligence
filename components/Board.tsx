"use client";

import { useCallback, useEffect, useState } from "react";
import type { BoardIdea } from "@/lib/supabase";
import { formatMoney } from "@/lib/market";
import BackDialog from "./BackDialog";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  biomed: "Biomedicine",
  markets: "Markets",
  "supply-chain": "Supply Chain",
  science: "Science",
  math: "Math",
  other: "Wildcard",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI" },
  { key: "biomed", label: "Biomedicine" },
  { key: "markets", label: "Markets" },
  { key: "supply-chain", label: "Supply Chain" },
  { key: "science", label: "Science" },
  { key: "math", label: "Math" },
  { key: "other", label: "Wildcard" },
];

export default function Board({ initial }: { initial: BoardIdea[] }) {
  const [ideas, setIdeas] = useState<BoardIdea[]>(initial);
  const [filter, setFilter] = useState("all");
  const [backing, setBacking] = useState<{
    idea: BoardIdea;
    preset?: number;
  } | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/board", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.ideas)) setIdeas(data.ideas);
      }
    } catch {
      // keep showing the last known board
    }
  }, []);

  useEffect(() => {
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, [refresh]);

  const open = ideas.filter((i) => i.status === "open");
  const covered = ideas.filter((i) => i.status !== "open");
  const leaderCents = Math.max(1, ...open.map((i) => i.total_cents));
  const leaderId =
    open.length > 0 && open[0].total_cents > 0 ? open[0].id : null;
  const visible =
    filter === "all" ? open : open.filter((i) => i.category === filter);

  return (
    <>
      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter${filter === f.key ? " on" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((idea) => {
          const isLeader = idea.id === leaderId;
          const climbing =
            !isLeader &&
            idea.last_backed_at != null &&
            Date.now() - new Date(idea.last_backed_at).getTime() <
              24 * 3600_000;
          return (
            <div key={idea.id} className={`card${isLeader ? " leader" : ""}`}>
              <div className="card-top">
                <div className="card-title">
                  {idea.link ? (
                    <a
                      href={idea.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {idea.title}
                    </a>
                  ) : (
                    idea.title
                  )}
                </div>
                <div className="pool">
                  <div className="amt">{formatMoney(idea.total_cents)}</div>
                  <div className="cap">in the pool</div>
                </div>
              </div>

              <div className="card-tags">
                {isLeader && <span className="tag-leader">★ LEADER</span>}
                {climbing && <span className="tag-climbing">▲ CLIMBING</span>}
                <span className="chip">
                  {CATEGORY_LABELS[idea.category] ?? idea.category}
                </span>
              </div>

              {idea.detail ? (
                <div className="card-detail">{idea.detail}</div>
              ) : null}

              <div className="fund-track">
                <div
                  className={`fund-fill${isLeader ? " shimmer" : ""}`}
                  style={{
                    width: `${Math.max(
                      idea.total_cents > 0 ? 4 : 0,
                      Math.round((idea.total_cents / leaderCents) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="card-foot">
                <span className="backers-n">
                  {idea.total_cents > 0
                    ? `${idea.backers} backer${idea.backers === 1 ? "" : "s"}`
                    : "Be the first"}
                </span>
                <div className="quick-row">
                  <button
                    className="quick"
                    onClick={() => setBacking({ idea, preset: 500 })}
                  >
                    Back $5
                  </button>
                  <button
                    className="quick"
                    onClick={() => setBacking({ idea, preset: 2500 })}
                  >
                    $25
                  </button>
                  <button
                    className="quick"
                    onClick={() => setBacking({ idea })}
                  >
                    More
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {covered.length > 0 && (
        <>
          <div className="section-head">
            <h2>Shipped</h2>
            <span className="count">
              {covered.length} brief{covered.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="shipped-list">
            {covered.map((idea) => (
              <div key={idea.id} className="shipped-row">
                <span className="check">✓</span>
                <span className="t">
                  {idea.brief_url ? (
                    <a
                      href={idea.brief_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {idea.title}
                    </a>
                  ) : (
                    idea.title
                  )}
                </span>
                <span className="amt">{formatMoney(idea.total_cents)}</span>
                <span className="when">
                  {idea.covered_at
                    ? new Date(idea.covered_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "covered"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {backing && (
        <BackDialog
          idea={backing.idea}
          preset={backing.preset}
          onClose={() => setBacking(null)}
          onBacked={() => {
            setBacking(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
