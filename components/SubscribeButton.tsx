"use client";

import { useEffect, useState } from "react";
import { nextBrief, countdownParts } from "@/lib/market";
import Modal from "./Modal";
import EmailCapture from "./EmailCapture";

export function BriefTimer() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return <div className="mo-count">Next brief · Tuesday, 7am ET</div>;
  }
  const p = countdownParts(nextBrief(now).getTime() - now.getTime());
  return (
    <div className="mo-count" suppressHydrationWarning>
      Next brief in{" "}
      <b>
        {p.days}d {String(p.hours).padStart(2, "0")}h{" "}
        {String(p.minutes).padStart(2, "0")}m
      </b>
    </div>
  );
}

export default function SubscribeButton({
  label = "Subscribe",
}: {
  label?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        type="button"
        className="mo-chip"
        onClick={() => setShow(true)}
      >
        {label}
      </button>
      {show && (
        <Modal
          title="Subscribe to the brief"
          subtitle="Every Tuesday at 7am ET. Always free."
          onClose={() => setShow(false)}
        >
          <div className="sub-modal">
            <EmailCapture variant="band" cta="Sign up — free" />
          </div>
        </Modal>
      )}
    </>
  );
}
