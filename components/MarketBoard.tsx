"use client";

import { useEffect, useRef, useState } from "react";

type Quote = {
  symbol: string;
  label: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
};

const REFRESH_MS = 30_000;

function fmtPrice(q: Quote) {
  return q.price == null ? "—" : q.price.toFixed(2);
}
function fmtPct(q: Quote) {
  if (q.changePct == null) return "";
  const s = q.changePct >= 0 ? "+" : "";
  return `${s}${q.changePct.toFixed(2)}%`;
}
function dir(q: Quote): "up" | "down" | "flat" {
  if (q.change == null || q.change === 0) return "flat";
  return q.change > 0 ? "up" : "down";
}

export default function MarketBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const r = await fetch("/api/ticker", { cache: "no-store" });
        if (!r.ok) throw new Error("bad status");
        const j = await r.json();
        if (!alive) return;
        const qs: Quote[] = j.quotes ?? [];
        setQuotes(qs);
        setUpdated(j.updated ?? new Date().toISOString());
        setStatus(qs.some((q) => q.price != null) ? "ok" : "error");
      } catch {
        if (alive) setStatus((s) => (s === "ok" ? "ok" : "error"));
      }
    }
    load();
    timer.current = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const updatedLabel = updated
    ? new Date(updated).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const marquee = quotes.length ? [...quotes, ...quotes] : [];

  return (
    <div className="mo-wrap">
      <section className="mb">
        <div className="mb-head">
          <span className="mb-live">
            <span
              className={`mb-dot ${status === "ok" ? "on" : ""}`}
              aria-hidden="true"
            />
            {status === "ok" ? "Live" : status === "loading" ? "Loading…" : "Reconnecting…"}
          </span>
          <span className="mb-updated mono">
            Updated {updatedLabel} · delayed quotes, auto-refreshing
          </span>
        </div>

        {/* scrolling ticker */}
        <div className="ticker" aria-hidden="true">
          {marquee.length ? (
            <div className="ticker-track">
              {marquee.map((q, i) => (
                <span key={`${q.symbol}-${i}`} className={`ticker-item ${dir(q)}`}>
                  <b>{q.symbol}</b>
                  <span>{fmtPrice(q)}</span>
                  <span className="ticker-pct">{fmtPct(q)}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="ticker-track ticker-idle">Fetching live markets…</div>
          )}
        </div>

        {/* board grid */}
        <div className="mb-grid">
          {quotes.map((q) => (
            <div key={q.symbol} className={`mb-cell ${dir(q)}`}>
              <div className="mb-cell-top">
                <span className="mb-sym">{q.symbol}</span>
                <span className="mb-pct">{fmtPct(q)}</span>
              </div>
              <div className="mb-price">{fmtPrice(q)}</div>
              <div className="mb-label">{q.label}</div>
            </div>
          ))}
        </div>

        <p className="mb-foot mono">
          Sector proxies (ETFs) for the markets we interface with. Quotes via a
          public feed, typically ~15-min delayed — not investment advice.
        </p>
      </section>
    </div>
  );
}
