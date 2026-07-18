"use client";

import type { BoardIdea } from "@/lib/supabase";
import { useMarket } from "./MarketProvider";

export default function FundTopic() {
  const { ideas, openBackNew, openBackExisting } = useMarket();
  // Silent ordering by backing — no amounts, ranks, or deltas shown.
  const open = ideas
    .filter((i) => i.status === "open")
    .sort((a, b) => b.total_cents - a.total_cents);

  return (
    <div className="fund-block">
      <p className="section-sub">
        Curious about something hard? Put it on the list. The most-backed topic
        becomes next Tuesday&rsquo;s brief.
      </p>

      <div className="fund-actions">
        <button className="btn btn-gold" onClick={openBackNew}>
          Suggest a topic
        </button>
        <span className="fund-note">from $5, or name your amount.</span>
      </div>

      {open.length > 0 && (
        <>
          <div className="on-list-label">On the list</div>
          <ul className="topic-list">
            {open.map((idea) => (
              <li key={idea.id} className="topic-row">
                <span className="topic-title">
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
                </span>
                <button
                  className="back-quiet"
                  onClick={() => openBackExisting(idea)}
                >
                  Back this ▸
                </button>
              </li>
            ))}
          </ul>
          <p className="topic-foot">Topics keep their backing until they ship.</p>
        </>
      )}
    </div>
  );
}
