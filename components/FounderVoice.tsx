"use client";

import { useState } from "react";

const CONTACT =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";
const MAILTO = `mailto:${CONTACT}?subject=${encodeURIComponent(
  "Writing & research services — let's talk"
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
    <>
      <section className="frame-sec fv-intro">
        <div className="ed-kicker">Writing &amp; research services</div>
        <h1 className="ed-statement">Founder Voice</h1>
        <p className="ed-sub">
          Technical content, written in your voice, published under your name.
        </p>
        <p className="fv-body">
          Starts with a 45-minute conversation a month about your technology,
          your market, your ideas. Our team writes the briefs — technical detail
          down to its underlying assumptions, or however you need. You review
          our draft, we revise, you publish.
        </p>
      </section>

      <section className="frame-sec">
        <div className="fv-tiers2">
          <div className="fv-tier2">
            <h2 className="fv-name">Founder Voice</h2>
            <div className="fv-price2">
              From $1,500<span>/mo</span>
            </div>
            <ul className="fv-list">
              <li>Two publish-ready pieces a month</li>
              <li>Monthly 45-minute extraction call</li>
              <li>Two revision rounds</li>
            </ul>
            <button
              className="fv-sub"
              onClick={() => subscribe("founder_voice")}
              disabled={busy !== null}
            >
              {busy === "founder_voice" ? "Working…" : "Subscribe →"}
            </button>
          </div>

          <div className="fv-tier2">
            <h2 className="fv-name">Founder Voice+</h2>
            <div className="fv-price2">
              From $2,500<span>/mo</span>
            </div>
            <ul className="fv-list">
              <li>Four pieces a month</li>
              <li>LinkedIn-native adaptation of each</li>
              <li>Monthly call, two revision rounds</li>
            </ul>
            <button
              className="fv-sub"
              onClick={() => subscribe("founder_voice_plus")}
              disabled={busy !== null}
            >
              {busy === "founder_voice_plus" ? "Working…" : "Subscribe →"}
            </button>
          </div>
        </div>
      </section>

      <section className="frame-sec">
        <h2 className="ed-title">How it works</h2>
        <ol className="fv-steps">
          <li>
            <b>Voice audit.</b> We read your past posts, talks, and decks to
            learn how you actually sound.
          </li>
          <li>
            <b>Monthly call.</b> A recorded 45-minute conversation where we draw
            out your opinions — the call is where the work comes from.
          </li>
          <li>
            <b>Drafts in five business days.</b> Argument-driven, technical but
            legible, 800&ndash;1,500 words.
          </li>
          <li>
            <b>Two revision rounds.</b> Then you publish, under your name.
          </li>
        </ol>
        <p className="fv-private2">
          Your name on the work. Our involvement stays private, always — our
          client list is confidential by default. Month-to-month, full IP
          assignment on payment, 30-day cancellation.
        </p>
      </section>

      <section className="frame-sec fv-cta2">
        <a className="btn btn-ink" href={MAILTO}>
          Start a conversation
        </a>
        <a className="ed-more" href="/briefs">
          The briefs are our portfolio — read them first →
        </a>
        {err && <p className="form-msg err">{err}</p>}
      </section>
    </>
  );
}
