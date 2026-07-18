"use client";

import { useEffect, useState } from "react";
import { nextBrief, countdownParts } from "@/lib/market";

// Tiny masthead timer: "Next brief in _d __h __m · Tuesdays, 7am ET"
export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return <span className="masthead-timer">Tuesdays · 7am ET</span>;
  }

  const p = countdownParts(nextBrief(now).getTime() - now.getTime());
  return (
    <span className="masthead-timer" suppressHydrationWarning>
      <span className="mt-count">
        Next brief in {p.days}d {String(p.hours).padStart(2, "0")}h{" "}
        {String(p.minutes).padStart(2, "0")}m
      </span>
      <span className="mt-sep"> · </span>
      <span className="mt-cadence">Tuesdays, 7am ET</span>
    </span>
  );
}
