"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

export default function FounderVoice() {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);

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
      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Content under your name</div>
          <h1 className="mo-h1">
            Writing
            <br />
            Services.
          </h1>
          <p className="mo-lede">
            Well-researched, technical content — written in your voice and
            published under your name. Starts with a 45-minute conversation a
            month; our team writes, you review, we revise, you publish. Our
            involvement stays private.
          </p>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* tiers */}
      <div className="mo-wrap">
        <section className="mkt-current">
          <div className="mo-features-head">
            <span>// Retainers</span>
            <span>02 / Plans</span>
          </div>
          <div className="mo-axis" />
          <div className="fv-grid">
            <article className="fv-plan">
              <div className="mo-card-idx">01</div>
              <h2 className="mo-card-h">Founder Voice</h2>
              <div className="fv-price">
                From $1,500<span> / mo</span>
              </div>
              <ul className="fv-list">
                <li>Two publish-ready pieces a month</li>
              </ul>
              <button
                className="btn-ghost"
                onClick={() => subscribe("founder_voice")}
                disabled={busy !== null}
              >
                {busy === "founder_voice" ? "Working…" : "Subscribe →"}
              </button>
            </article>

            <article className="fv-plan">
              <div className="mo-card-idx">02</div>
              <h2 className="mo-card-h">Founder Voice+</h2>
              <div className="fv-price">
                From $2,500<span> / mo</span>
              </div>
              <ul className="fv-list">
                <li>Four pieces a month</li>
              </ul>
              <button
                className="btn-ghost"
                onClick={() => subscribe("founder_voice_plus")}
                disabled={busy !== null}
              >
                {busy === "founder_voice_plus" ? "Working…" : "Subscribe →"}
              </button>
            </article>
          </div>
        </section>
      </div>

      {/* how it works — numbered cards on a shared axis */}
      <div className="mo-wrap">
        <section className="mo-features">
          <div className="mo-features-head">
            <span>// How it works</span>
            <span>04 / Steps</span>
          </div>
          <div className="mo-axis" />
          <div className="mo-cards mo-cards-4">
            <article className="mo-card">
              <div className="mo-card-idx">01</div>
              <h3 className="mo-card-h">Voice audit</h3>
              <p className="mo-card-desc">
                We read your past posts, talks, and decks to learn how you
                actually sound.
              </p>
            </article>
            <article className="mo-card">
              <div className="mo-card-idx">02</div>
              <h3 className="mo-card-h">Monthly call</h3>
              <p className="mo-card-desc">
                A recorded 45-minute conversation where we draw out your
                opinions — the call is where the work comes from.
              </p>
            </article>
            <article className="mo-card">
              <div className="mo-card-idx">03</div>
              <h3 className="mo-card-h">Drafts in 5 days</h3>
              <p className="mo-card-desc">
                Argument-driven, technical but legible, 800–1,500 words,
                delivered in five business days.
              </p>
            </article>
            <article className="mo-card">
              <div className="mo-card-idx">04</div>
              <h3 className="mo-card-h">Two revisions</h3>
              <p className="mo-card-desc">
                Then you publish, under your name. Full IP assignment on
                payment, month-to-month, 30-day cancellation.
              </p>
            </article>
          </div>
        </section>
      </div>

      {/* private + cta */}
      <div className="mo-wrap">
        <section className="fv-cta">
          <div className="mo-features-head">
            <span>// Private by default</span>
            <span>Get started</span>
          </div>
          <div className="mo-axis" />
          <div className="fv-cta-row">
            <p className="mo-card-desc fv-private">
              Your name on the work. Our involvement stays private, always.
            </p>
            <div className="fv-cta-actions">
              <button
                type="button"
                className="btn-blk"
                onClick={() => setShowContact(true)}
              >
                Contact us →
              </button>
            </div>
          </div>
          {err && <p className="cf-msg err">{err}</p>}
        </section>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
