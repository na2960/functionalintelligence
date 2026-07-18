"use client";

import { useState } from "react";

const CONTACT =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";
const MAILTO = `mailto:${CONTACT}?subject=${encodeURIComponent(
  "Founder Voice — let's talk"
)}`;

export default function FounderVoice() {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function subscribe(tier: "founder_voice" | "founder_voice_plus") {
    setBusy(tier);
    setErr(null);
    try {
      const res = await fetch("/api/retainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.url)
        throw new Error(data.error ?? "Please email us instead.");
      window.location.href = data.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Please email us instead.");
      setBusy(null);
    }
  }

  return (
    <section id="founder-voice" className="frame-sec fv">
      <div className="fv-head">
        <div className="fv-kicker">Work with us</div>
        <h2>Founder Voice</h2>
        <p className="fv-intro">
          Starts with a 45-minute conversation a month about your technology,
          your market, your ideas. Our team writes the briefs: technical details
          down to underlying assumptions, or however you need. You review our
          draft, we revise, you publish.
        </p>
        <p className="fv-tag">
          Technical content, written in your voice, published under your name.
        </p>
      </div>

      <div className="fv-tiers">
        <div className="fv-tier">
          <h3>Founder Voice</h3>
          <div className="fv-price">
            From $1,500<span>/mo</span>
          </div>
          <ul>
            <li>Two published-ready pieces a month</li>
            <li>Monthly 45-minute extraction call</li>
            <li>Two revision rounds</li>
          </ul>
          <button
            className="fv-subscribe"
            onClick={() => subscribe("founder_voice")}
            disabled={busy !== null}
          >
            {busy === "founder_voice" ? "Working…" : "Subscribe now →"}
          </button>
        </div>

        <div className="fv-tier feature">
          <div className="fv-badge">Most popular</div>
          <h3>Founder Voice+</h3>
          <div className="fv-price">
            From $2,500<span>/mo</span>
          </div>
          <ul>
            <li>Four pieces a month</li>
            <li>LinkedIn-native adaptation of each</li>
            <li>Monthly call, two revision rounds</li>
          </ul>
          <button
            className="fv-subscribe"
            onClick={() => subscribe("founder_voice_plus")}
            disabled={busy !== null}
          >
            {busy === "founder_voice_plus" ? "Working…" : "Subscribe now →"}
          </button>
        </div>
      </div>

      <p className="fv-private">
        Your name on the work. Our involvement stays private, always. Our client
        list is confidential by default.
      </p>

      <div className="fv-cta">
        <a className="btn btn-gold" href={MAILTO}>
          Start a conversation
        </a>
        <a className="fv-portfolio" href="/briefs">
          The briefs are our portfolio — read them first →
        </a>
      </div>
      {err && <p className="form-msg err">{err}</p>}
    </section>
  );
}
