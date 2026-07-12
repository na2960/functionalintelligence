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

export default function Board({ initial }: { initial: BoardIdea[] }) {
  const [ideas, setIdeas] = useState<BoardIdea[]>(initial);
  const [backing, setBacking] = useState<BoardIdea | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/board", { cache: "no-store" });
      if (res.ok) setIdeas(await res.json());
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

  return (
    <>
      <div className="board">
        {open.map((idea, idx) => (
          <div key={idea.id} className={`row${idx === 0 && idea.total_cents > 0 ? " leader" : ""}`}>
            <div className="rank">{String(idx + 1).padStart(2, "0")}</div>
            <div>
              <div className="idea-title">
                {idea.link ? (
                  <a href={idea.link} target="_blank" rel="noopener noreferrer">
                    {idea.title}
                  </a>
                ) : (
                  idea.title
                )}
              </div>
              <div className="idea-meta">
                <span className="chip">
                  {CATEGORY_LABELS[idea.category] ?? idea.category}
                </span>
                {idea.detail ? <span>{idea.detail}</span> : null}
              </div>
            </div>
            <div className="money-cell">
              <span className="money">{formatMoney(idea.total_cents)}</span>
              {idea.total_cents > 0 ? (
                <span className="backers-n">
                  {idea.backers} backer{idea.backers === 1 ? "" : "s"}
                </span>
              ) : (
                <span className="zero-note">be the first</span>
              )}
              <button className="back-btn" onClick={() => setBacking(idea)}>
                Back this →
              </button>
            </div>
            <div className="fund-track">
              <div
                className="fund-fill"
                style={{
                  width: `${Math.max(
                    idea.total_cents > 0 ? 4 : 0,
                    Math.round((idea.total_cents / leaderCents) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {covered.length > 0 && (
        <>
          <div className="section-head">
            <h2>SHIPPED</h2>
            <div className="rule" />
          </div>
          <div className="board">
            {covered.map((idea) => (
              <div key={idea.id} className="row">
                <div className="rank">✓</div>
                <div>
                  <div className="idea-title">
                    {idea.brief_url ? (
                      <a href={idea.brief_url} target="_blank" rel="noopener noreferrer">
                        {idea.title}
                      </a>
                    ) : (
                      idea.title
                    )}
                  </div>
                  <div className="idea-meta">
                    <span className="chip">
                      {CATEGORY_LABELS[idea.category] ?? idea.category}
                    </span>
                    <span>
                      covered
                      {idea.covered_at
                        ? ` · ${new Date(idea.covered_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="money-cell">
                  <span className="money">{formatMoney(idea.total_cents)}</span>
                  <span className="backers-n">final</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {backing && (
        <BackDialog
          idea={backing}
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
