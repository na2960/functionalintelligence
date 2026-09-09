import { NextResponse } from "next/server";

// Live market quotes for the sectors Functional Intelligence interfaces with.
// Robust + free by design: two independent keyless sources (Yahoo Finance and
// Stooq) with a short server cache and a last-good fallback, so an intermittent
// upstream failure never blanks the board and there is no single provider to
// depend on. Fetched server-side (no CORS); the client polls every ~30s.
export const dynamic = "force-dynamic";

const INSTRUMENTS: { symbol: string; label: string }[] = [
  { symbol: "XLE", label: "Energy" },
  { symbol: "UNG", label: "Natural gas" },
  { symbol: "XLU", label: "Utilities / power" },
  { symbol: "FAN", label: "Wind" },
  { symbol: "TAN", label: "Solar" },
  { symbol: "XLB", label: "Materials" },
  { symbol: "LIT", label: "Battery & lithium" },
  { symbol: "REMX", label: "Rare earths" },
  { symbol: "URA", label: "Uranium / nuclear" },
  { symbol: "COPX", label: "Copper" },
];

type Quote = {
  symbol: string;
  label: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
};

// Warm-instance caches (reset on cold start — that's fine).
const lastGood = new Map<string, Quote>();
let cache: { at: number; quotes: Quote[] } | null = null;
const CACHE_MS = 20_000;

async function fromYahoo(
  host: "query1" | "query2",
  symbol: string
): Promise<{ price: number; prev: number; currency: string } | null> {
  try {
    const r = await fetch(
      `https://${host}.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; FunctionalIntelligence/1.0; +https://funcimarket.com)",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!r.ok) return null;
    const j = await r.json();
    const m = j?.chart?.result?.[0]?.meta;
    if (!m || typeof m.regularMarketPrice !== "number") return null;
    const prev =
      typeof m.chartPreviousClose === "number"
        ? m.chartPreviousClose
        : typeof m.previousClose === "number"
          ? m.previousClose
          : m.regularMarketPrice;
    return { price: m.regularMarketPrice, prev, currency: m.currency ?? "USD" };
  } catch {
    return null;
  }
}

async function fromStooq(
  symbol: string
): Promise<{ price: number; currency: string } | null> {
  try {
    const r = await fetch(
      `https://stooq.com/q/l/?s=${symbol.toLowerCase()}.us&f=sc&h&e=csv`,
      { cache: "no-store", signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) return null;
    const text = await r.text();
    const line = text.trim().split(/\r?\n/).pop() ?? "";
    const close = line.split(",").pop()?.trim();
    const price = close ? Number(close) : NaN;
    if (!Number.isFinite(price)) return null;
    return { price, currency: "USD" };
  } catch {
    return null;
  }
}

async function quoteFor(it: {
  symbol: string;
  label: string;
}): Promise<Quote> {
  const y =
    (await fromYahoo("query1", it.symbol)) ??
    (await fromYahoo("query2", it.symbol));
  if (y) {
    const change = y.price - y.prev;
    const q: Quote = {
      ...it,
      price: y.price,
      change,
      changePct: y.prev ? (change / y.prev) * 100 : 0,
      currency: y.currency,
    };
    lastGood.set(it.symbol, q);
    return q;
  }
  const s = await fromStooq(it.symbol);
  if (s) {
    const prev = lastGood.get(it.symbol);
    const q: Quote = {
      ...it,
      price: s.price,
      // keep last known day-change if we have it; otherwise leave it blank
      change: prev?.change ?? null,
      changePct: prev?.changePct ?? null,
      currency: s.currency,
    };
    lastGood.set(it.symbol, q);
    return q;
  }
  // Everything failed this cycle — serve the last good value if we have one.
  return (
    lastGood.get(it.symbol) ?? {
      ...it,
      price: null,
      change: null,
      changePct: null,
      currency: "USD",
    }
  );
}

function mockQuotes(): Quote[] {
  const base: Record<string, [number, number]> = {
    XLE: [92.4, 91.8], UNG: [14.7, 15.1], XLU: [79.2, 78.6], FAN: [17.9, 17.7],
    TAN: [33.1, 34.0], XLB: [91.6, 91.9], LIT: [41.3, 40.5], REMX: [28.8, 28.2],
    URA: [39.5, 38.9], COPX: [46.2, 45.7],
  };
  return INSTRUMENTS.map((it) => {
    const [price, prev] = base[it.symbol] ?? [100, 100];
    const change = price - prev;
    return { ...it, price, change, changePct: (change / prev) * 100, currency: "USD" };
  });
}

export async function GET() {
  if (process.env.FI_MOCK === "1") {
    return NextResponse.json(
      { updated: new Date().toISOString(), quotes: mockQuotes() },
      { headers: { "cache-control": "no-store" } }
    );
  }

  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json(
      { updated: new Date(cache.at).toISOString(), quotes: cache.quotes },
      { headers: { "cache-control": "no-store" } }
    );
  }

  const quotes = await Promise.all(INSTRUMENTS.map(quoteFor));
  cache = { at: Date.now(), quotes };

  return NextResponse.json(
    { updated: new Date(cache.at).toISOString(), quotes },
    { headers: { "cache-control": "no-store" } }
  );
}
