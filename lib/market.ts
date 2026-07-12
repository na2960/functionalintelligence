// Market clock for The Board.
// Briefs ship Tuesday & Thursday at 7:00 AM ET.
// The market for each issue closes at 8:00 PM ET the night before
// (Monday and Wednesday), then immediately reopens for the next issue.

const ET = "America/New_York";

type EtParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number; // 0 = Sunday
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function etParts(date: Date): EtParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  };
}

// Convert an ET wall-clock time to a UTC Date (two-pass DST-safe guess).
function etToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const p = etParts(new Date(guess));
    const seen = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    const want = Date.UTC(year, month - 1, day, hour, minute);
    guess += want - seen;
  }
  return new Date(guess);
}

export type MarketState = {
  closesAt: Date; // next Mon/Wed 8:00 PM ET
  issueAt: Date; // the Tue/Thu 7:00 AM ET it feeds
  issueDay: "Tuesday" | "Thursday";
};

export function marketState(now: Date = new Date()): MarketState {
  // Walk forward day by day (in ET) to find the next close that is still ahead.
  for (let offset = 0; offset < 9; offset++) {
    const probe = new Date(now.getTime() + offset * 86400_000);
    const p = etParts(probe);
    if (p.weekday === 1 || p.weekday === 3) {
      const close = etToUtc(p.year, p.month, p.day, 20, 0);
      if (close.getTime() > now.getTime()) {
        const issue = new Date(close.getTime() + 11 * 3600_000); // next day 7:00 AM ET
        const ip = etParts(issue);
        const issueAt = etToUtc(ip.year, ip.month, ip.day, 7, 0);
        return {
          closesAt: close,
          issueAt,
          issueDay: p.weekday === 1 ? "Tuesday" : "Thursday",
        };
      }
    }
  }
  throw new Error("could not compute market state");
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const s = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toLocaleString("en-US")}`
    : `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}
