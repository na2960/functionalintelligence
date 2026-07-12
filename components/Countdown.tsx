"use client";

import { useEffect, useState } from "react";
import { marketState, formatCountdown } from "@/lib/market";

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
        <span className="label">MARKET CLOSES IN</span>
        <span className="clock">--:--:--</span>
        <span className="ships">TOP IDEA SHIPS TUE &amp; THU · 7:00 AM ET</span>
      </div>
    );
  }

  const m = marketState(now);
  const remaining = m.closesAt.getTime() - now.getTime();
  const closeDay = m.issueDay === "Tuesday" ? "MON" : "WED";

  return (
    <div className="close-bar">
      <span className="label">
        MARKET CLOSES {closeDay} 8:00 PM ET · IN
      </span>
      <span className="clock" suppressHydrationWarning>
        {formatCountdown(remaining)}
      </span>
      <span className="ships">
        {m.issueDay.toUpperCase()}&rsquo;S BRIEF SHIPS 7:00 AM ET
      </span>
    </div>
  );
}
