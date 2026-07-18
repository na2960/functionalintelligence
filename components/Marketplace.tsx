"use client";

import { formatMoney } from "@/lib/market";
import type { BoardIdea } from "@/lib/supabase";
import MarketProvider, { useMarket } from "./MarketProvider";

export default function Marketplace({ board }: { board: BoardIdea[] }) {
  return (
    <MarketProvider initialIdeas={board}>
      <FundPanel />
    </MarketProvider>
  );
}

function FundPanel() {
  const { ideas, openBackNew, openBackExisting } = useMarket();
  const open = ideas
    .filter((i) => i.status === "open")
    .sort((a, b) => b.total_cents - a.total_cents);

  return (
    <div className="mo-wrap">
      <section id="board" className="mkt-fund">
        <div className="mo-features-head">
          <span>// The Board</span>
          <span>{String(open.length).padStart(2, "0")} topics</span>
        </div>
        <div className="mo-axis" />
        <div className="mkt-fund-row">
          <div className="mkt-fund-copy">
            <h2 className="mkt-h2">Back any topic you want us to cover.</h2>
            <p className="mo-card-desc">
              Put a hard question on the board — $5, or name your amount. The
              highest-backed topic becomes our next brief. Backing funds
              coverage; every brief stays free to read.
            </p>
            <button type="button" className="btn-blk" onClick={openBackNew}>
              Back a topic →
            </button>
          </div>

          <div className="mkt-board-wrap">
            <div className="mkt-board-head mono">
              <span>Rank</span>
              <span>Topic</span>
              <span>Backed</span>
            </div>
            <div className="mkt-board-scroll">
              {open.length === 0 ? (
                <p className="board-empty">No topics on the board yet.</p>
              ) : (
                <ol className="mkt-board">
                  {open.map((idea, i) => (
                    <li key={idea.id} className="mkt-board-row">
                      <span className="board-rank">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mkt-board-topic">{idea.title}</span>
                      <span className="board-amt">
                        {idea.total_cents > 0
                          ? formatMoney(idea.total_cents)
                          : "—"}
                      </span>
                      <button
                        type="button"
                        className="mo-link"
                        onClick={() => openBackExisting(idea)}
                      >
                        Back →
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <button
              type="button"
              className="mkt-board-new"
              onClick={openBackNew}
            >
              + Back something new →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
