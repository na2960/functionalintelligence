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

// Weekly cadence: one brief every Tuesday at 7:00 AM ET. Returns the next
// Tuesday 7:00 AM ET that is still ahead of `now`.
export function nextBrief(now: Date = new Date()): Date {
  for (let offset = 0; offset < 14; offset++) {
    const probe = new Date(now.getTime() + offset * 86400_000);
    const p = etParts(probe);
    if (p.weekday === 2) {
      // Tuesday
      const issue = etToUtc(p.year, p.month, p.day, 7, 0);
      if (issue.getTime() > now.getTime()) return issue;
    }
  }
  throw new Error("could not compute next brief time");
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function countdownParts(ms: number): CountdownParts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toLocaleString("en-US")}`
    : `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}
