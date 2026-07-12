"use client";

import { useCallback, useEffect, useState } from "react";
import type { BoardIdea } from "@/lib/supabase";
import { formatMoney, marketState } from "@/lib/market";
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

function QuickRow({
  idea,
  onPick,
}: {
  idea: BoardIdea;
  onPick: (idea: BoardIdea, preset?: number) => void;
}) {
  return (
    <div className="quick-row">
      <button className="quick" onClick={() => onPick(idea, 500)}>
        Back $5
      </button>
      <button className="quick" onClick={() => onPick(idea, 2500)}>
        $25
      </button>
      <button className="quick" onClick={() => onPick(idea)}>
        More
      </button>
    </div>
  );
}

export default function Board({ initial }: { initial: BoardIdea[] }) {
  const [ideas, setIdeas] = useState<BoardIdea[]>(initial);
  const [filter, setFilter] = useState("all");
  const [issueDay, setIssueDay] = useState<string | null>(null);
  const [backing, setBacking] = useState<{
    idea: BoardIdea;
    preset?: number;
  } | null>(null);

  useEffect(() => {
    setIssueDay(marketState().issueDay);
  }, []);

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
  const hasLeader = open.length > 0 && open[0].total_cents > 0;
  const leader = hasLeader ? open[0] : null;
  const challengers = hasLeader ? open.slice(1) : open;
  const pick = (idea: BoardIdea, preset?: number) =>
    setBacking({ idea, preset });
  const shipsLabel = issueDay
    ? `SHIPS ${issueDay.toUpperCase()} 7:00 AM ET`
    : "SHIPS NEXT ISSUE · 7:00 AM ET";

  return (
    <>
      {leader ? (
        <div className="throne">
          <div className="throne-banner">
            <span className="throne-rank">#1</span>
            <span>★ IN THE LEAD — THIS ONE {shipsLabel}</span>
          </div>
          <div className="throne-body">
            <div className="throne-main">
              <div className="throne-title">
                {leader.link ? (
                  <a
                    href={leader.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {leader.title}
                  </a>
                ) : (
                  leader.title
                )}
              </div>
              <div className="card-tags">
                <span className="chip">
                  {CATEGORY_LABELS[leader.category] ?? leader.category}
                </span>
                <span className="backers-n">
                  {leader.backers} backer{leader.backers === 1 ? "" : "s"}
                </span>
              </div>
              {leader.detail ? (
                <div className="card-detail">{leader.detail}</div>
              ) : null}
            </div>
            <div className="throne-money">
              <div className="pool">
                <div className="amt big">{formatMoney(leader.total_cents)}</div>
                <div className="cap">in the pool</div>
              </div>
              <QuickRow idea={leader} onPick={pick} />
            </div>
          </div>
          <div className="fund-track">
            <div className="fund-fill shimmer" style={{ width: "100%" }} />
          </div>
        </div>
      ) : (
        open.length > 0 && (
          <div className="no-leader">
            No leader yet — the first dollar takes the crown. Winner ships{" "}
            {issueDay ?? "Tuesday"} 7:00 AM ET.
          </div>
        )
      )}

      {challengers.length > 0 && (
        <>
          <div className="chase-head">
            <span className="chase-label">
              {leader ? "THE CHASE — beat the leader before close" : "THE FIELD"}
            </span>
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
          </div>

          <div className="ranks">
            {challengers.map((idea, idx) => {
              const rank = hasLeader ? idx + 2 : idx + 1;
              if (filter !== "all" && idea.category !== filter) return null;
              const climbing =
                idea.last_backed_at != null &&
                Date.now() - new Date(idea.last_backed_at).getTime() <
                  24 * 3600_000;
              const gap = leader
                ? leader.total_cents - idea.total_cents
                : null;
              return (
                <div key={idea.id} className="rank-row">
                  <div className="rank-n">
                    {String(rank).padStart(2, "0")}
                  </div>
                  <div className="rank-main">
                    <div className="rank-title">
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
                    <div className="card-tags">
                      {climbing && (
                        <span className="tag-climbing">▲ CLIMBING</span>
                      )}
                      <span className="chip">
                        {CATEGORY_LABELS[idea.category] ?? idea.category}
                      </span>
                      <span className="backers-n">
                        {idea.total_cents > 0
                          ? `${idea.backers} backer${idea.backers === 1 ? "" : "s"}`
                          : "Be the first"}
                      </span>
                      {gap != null && gap > 0 && (
                        <span className="gap">
                          {formatMoney(gap)} behind the lead
                        </span>
                      )}
                    </div>
                    <div className="fund-track">
                      <div
                        className="fund-fill"
                        style={{
                          width: `${Math.max(
                            idea.total_cents > 0 ? 4 : 0,
                            Math.round(
                              (idea.total_cents / leaderCents) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="rank-side">
                    <div className="pool">
                      <div className="amt">
                        {formatMoney(idea.total_cents)}
                      </div>
                      <div className="cap">in the pool</div>
                    </div>
                    <QuickRow idea={idea} onPick={pick} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

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
                  <a href={`/briefs/${idea.id}`}>{idea.title}</a>
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
