"use client";

import { useEffect, useState } from "react";
import { marketState, countdownParts } from "@/lib/market";

function Segments({ ms }: { ms: number }) {
  const p = countdownParts(ms);
  const segs = [
    { n: p.days, u: "d" },
    { n: p.hours, u: "h" },
    { n: p.minutes, u: "m" },
    { n: p.seconds, u: "s" },
  ].filter((s, i) => i > 0 || s.n > 0); // drop the day segment once it's 0

  return (
    <span className="clock" suppressHydrationWarning>
      {segs.map((s, i) => (
        <span className="clock-seg" key={s.u}>
          <span className="clock-n">{String(s.n).padStart(2, "0")}</span>
          <span className="clock-u">{s.u}</span>
          {i < segs.length - 1 && <span className="clock-sep">:</span>}
        </span>
      ))}
    </span>
  );
}

export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Render a stable placeholder on the server to avoid hydration mismatch.
  if (!now) {
    return (
      <div className="close-bar">
        <span className="label">Market closes in</span>
        <span className="clock">&nbsp;</span>
        <span className="ships">Next brief · Tue &amp; Thu, 7:00 AM ET</span>
      </div>
    );
  }

  const m = marketState(now);
  const remaining = m.closesAt.getTime() - now.getTime();
  const closeDay = m.issueDay === "Tuesday" ? "Monday" : "Wednesday";
  const lastCall = remaining < 6 * 3600_000;

  return (
    <div className={`close-bar${lastCall ? " last-call" : ""}`}>
      <span className="label">
        {lastCall
          ? "Last call — market closes tonight, 8:00 PM ET"
          : `Market closes ${closeDay}, 8:00 PM ET`}
      </span>
      <Segments ms={remaining} />
      <span className="ships">
        Ships {m.issueDay} · 7:00 AM ET
      </span>
    </div>
  );
}
