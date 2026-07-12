"use client";

import { useEffect, useState } from "react";
import type { RecentBacking } from "@/lib/supabase";
import { formatMoney, timeAgo } from "@/lib/market";

const TEASERS = [
  "THE BOARD IS LIVE — FIRST BACKER SETS THE PACE",
  "TUESDAY'S SLOT IS WIDE OPEN",
  "EVEN $3 MAKES IT YOURS",
  "BACK IT OR WATCH SOMEONE ELSE'S IDEA SHIP",
];

export default function Ticker({ initial }: { initial: RecentBacking[] }) {
  const [items, setItems] = useState<RecentBacking[]>(initial);

  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.recent)) setItems(data.recent);
        }
      } catch {
        // keep last known ticker
      }
    }, 30_000);
    return () => clearInterval(t);
  }, []);

  const strip =
    items.length > 0
      ? items.map((b, i) => (
          <span className="tick" key={`${b.created_at}-${i}`}>
            <span className="tick-arrow">▲</span>
            <span className="tick-amt">{formatMoney(b.amount_cents)}</span>
            {b.backer_name ? ` ${b.backer_name} → ` : " → "}
            <span className="tick-title">{b.idea_title}</span>
            <span className="tick-time" suppressHydrationWarning>
              {timeAgo(b.created_at)}
            </span>
          </span>
        ))
      : TEASERS.map((t, i) => (
          <span className="tick" key={i}>
            <span className="tick-arrow">▲</span>
            {t}
          </span>
        ));

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-inner">
        <div className="ticker-run">{strip}</div>
        <div className="ticker-run">{strip}</div>
      </div>
    </div>
  );
}
