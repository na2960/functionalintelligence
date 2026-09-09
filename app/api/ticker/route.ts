import { NextResponse } from "next/server";

// Live-ish market quotes for the sectors Functional Intelligence interfaces
// with. Fetched server-side (no CORS, no key) from Yahoo Finance's public
// chart endpoint; the client polls this route every ~30s. Quotes from a free
// public feed are typically delayed ~15 minutes.
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

async function yahoo(
  symbol: string
): Promise<{ price: number; prev: number; currency: string } | null> {
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; FunctionalIntelligence/1.0; +https://funcimarket.com)",
        },
        next: { revalidate: 30 },
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

function mockQuotes(): Quote[] {
  // Deterministic-ish sample so the board renders where outbound quotes are
  // blocked (local/dev). Real quotes are used in production.
  const base: Record<string, [number, number]> = {
    XLE: [92.4, 91.8],
    UNG: [14.7, 15.1],
    XLU: [79.2, 78.6],
    FAN: [17.9, 17.7],
    TAN: [33.1, 34.0],
    XLB: [91.6, 91.9],
    LIT: [41.3, 40.5],
    REMX: [28.8, 28.2],
    URA: [39.5, 38.9],
    COPX: [46.2, 45.7],
  };
  return INSTRUMENTS.map((it) => {
    const [price, prev] = base[it.symbol] ?? [100, 100];
    const change = price - prev;
    return {
      ...it,
      price,
      change,
      changePct: (change / prev) * 100,
      currency: "USD",
    };
  });
}

export async function GET() {
  if (process.env.FI_MOCK === "1") {
    return NextResponse.json(
      { updated: new Date().toISOString(), quotes: mockQuotes() },
      { headers: { "cache-control": "no-store" } }
    );
  }

  const quotes: Quote[] = await Promise.all(
    INSTRUMENTS.map(async (it) => {
      const y = await yahoo(it.symbol);
      if (!y)
        return {
          ...it,
          price: null,
          change: null,
          changePct: null,
          currency: "USD",
        };
      const change = y.price - y.prev;
      const changePct = y.prev ? (change / y.prev) * 100 : 0;
      return { ...it, price: y.price, change, changePct, currency: y.currency };
    })
  );

  return NextResponse.json(
    { updated: new Date().toISOString(), quotes },
    { headers: { "cache-control": "no-store" } }
  );
}
