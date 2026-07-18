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
        <section className="mkt-head fv-hero">
          <div className="fv-hero-left">
            <div className="mo-eyebrow">// Content under your name</div>
            <h1 className="mo-h1">
              Writing
              <br />
              Services.
            </h1>
            <p className="mo-lede">
              Well-researched, technical content — written in your voice and
              published under your name. Starts with a monthly call; our team
              writes, you review, we revise, you publish.
            </p>
          </div>
          <div className="fv-hero-right">
            <p className="fv-hero-note">
              Your name on the work. Our involvement stays private, always.
            </p>
            <button
              type="button"
              className="btn-blk"
              onClick={() => setShowContact(true)}
            >
              Contact us →
            </button>
          </div>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* plans */}
      <div className="mo-wrap">
        <section className="mkt-current">
          <div className="mo-features-head">
            <span>// Plans</span>
          </div>
          <div className="mo-axis" />
          <div className="fv-grid">
            <article className="fv-plan">
              <h2 className="mo-card-h">Founder Voice</h2>
              <div className="fv-price">
                From $1,500<span> / mo</span>
              </div>
              <p className="fv-plan-desc">
                Two publish-ready, well-researched pieces a month — in your
                voice, under your name.
              </p>
              <div className="fv-plan-actions">
                <button
                  className="btn-blk"
                  onClick={() => subscribe("founder_voice")}
                  disabled={busy !== null}
                >
                  Subscribe →
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowContact(true)}
                >
                  Book a call
                </button>
              </div>
            </article>

            <article className="fv-plan">
              <h2 className="mo-card-h">Founder Voice+</h2>
              <div className="fv-price">
                From $2,500<span> / mo</span>
              </div>
              <p className="fv-plan-desc">
                Four pieces a month, with wider distribution and priority
                turnaround.
              </p>
              <div className="fv-plan-actions">
                <button
                  className="btn-blk"
                  onClick={() => subscribe("founder_voice_plus")}
                  disabled={busy !== null}
                >
                  Subscribe →
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowContact(true)}
                >
                  Book a call
                </button>
              </div>
            </article>
          </div>
          {err && <p className="cf-msg err">{err}</p>}
        </section>
      </div>

      {/* how it works */}
      <div className="mo-wrap">
        <section className="mo-features">
          <div className="mo-features-head">
            <span>// How it works</span>
          </div>
          <div className="mo-axis" />
          <div className="mo-cards mo-cards-4">
            <article className="mo-card">
              <h3 className="mo-card-h">Voice audit</h3>
              <p className="mo-card-desc">
                We read your past posts, talks, and decks to learn how you
                actually sound.
              </p>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Kickoff / Monthly Call</h3>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Drafts in 5 days</h3>
              <p className="mo-card-desc">
                800–1,500 words, delivered in five business days.
              </p>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Two revisions</h3>
              <p className="mo-card-desc">
                Publish under your name. Full IP assignment. Month-to-month.
              </p>
            </article>
          </div>
        </section>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
