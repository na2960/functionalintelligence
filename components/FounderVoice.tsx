"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

export default function FounderVoice() {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [contact, setContact] = useState<string | null>(null);

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
            <div className="mo-eyebrow">// Custom Researched Solutions</div>
            <h1 className="mo-h1">
              Research
              <br />
              Services.
            </h1>
            <p className="mo-lede">
              Well-researched, custom blueprints — designed specifically for
              your data model or problem statement, based on a review of
              state-of-the-art peer-reviewed literature. Can include
              post-implementation writing services.
            </p>
          </div>
          <div className="fv-hero-right">
            <button
              type="button"
              className="btn-blk"
              onClick={() => setContact("Research Services Inquiry")}
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
              <h2 className="mo-card-h">Custom Blueprint</h2>
              <div className="fv-price">
                From $2,000<span> / mo</span>
              </div>
              <p className="fv-plan-desc">
                For your data model or problem statement, based on peer-reviewed
                literature.
              </p>
              <ul className="fv-list">
                <li>Custom implementation blueprint — math explained simply</li>
              </ul>
              <div className="fv-plan-actions">
                <button
                  type="button"
                  className="btn-ghost fv-btn"
                  onClick={() => setContact("Custom Blueprint")}
                >
                  Book a call
                </button>
                <button
                  className="btn-blk fv-btn"
                  onClick={() => subscribe("founder_voice")}
                  disabled={busy !== null}
                >
                  Subscribe →
                </button>
              </div>
            </article>

            <article className="fv-plan">
              <h2 className="mo-card-h">Custom Blueprint+</h2>
              <div className="fv-price">
                From $2,500<span> / mo</span>
              </div>
              <p className="fv-plan-desc">
                Deeper coverage, with follow-through after implementation.
              </p>
              <ul className="fv-list">
                <li>Technical literature review of the state of the art</li>
                <li>Custom implementation blueprint — math explained simply</li>
                <li>Writing services, post-implementation</li>
              </ul>
              <div className="fv-plan-actions">
                <button
                  type="button"
                  className="btn-ghost fv-btn"
                  onClick={() => setContact("Custom Blueprint+")}
                >
                  Book a call
                </button>
                <button
                  className="btn-blk fv-btn"
                  onClick={() => subscribe("founder_voice_plus")}
                  disabled={busy !== null}
                >
                  Subscribe →
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
              <h3 className="mo-card-h">Kick-off Call</h3>
              <p className="mo-card-desc">
                We get familiar with your data model or your specific problem.
              </p>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Literature Review</h3>
              <p className="mo-card-desc">
                A review of state-of-the-art peer-reviewed literature with
                relevant implementations.
              </p>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Custom Blueprint</h3>
              <p className="mo-card-desc">The implementation blueprint is designed.</p>
            </article>
            <article className="mo-card">
              <h3 className="mo-card-h">Review and Revision</h3>
              <p className="mo-card-desc">
                The math and the review are explained simply. Revisions are
                discussed.
              </p>
            </article>
          </div>
        </section>
      </div>

      {contact && (
        <ContactModal context={contact} onClose={() => setContact(null)} />
      )}
    </>
  );
}
