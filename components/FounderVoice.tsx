"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

const AREAS = [
  {
    title: "Markets & Energy",
    body: "Weather, power, and gas markets; renewable generation; storage and demand. Calibrated, uncertainty-aware forecasts turned into auditable trading and hedging decisions.",
  },
  {
    title: "Materials Design",
    body: "Crystal stability, battery lifetime, catalyst screening. Physics-aware models that rank candidates by calibrated probability and spend compute where it finds the most real discoveries.",
  },
  {
    title: "Decision & Uncertainty",
    body: "Every model ships as a predictive distribution and a decision — rule, cost, capacity, out-of-sample interval — with the integrity checks that make a performance claim survive scrutiny.",
  },
];

const STEPS = [
  {
    h: "Frame the problem",
    p: "The data model, the decision it feeds, and the value at stake.",
  },
  {
    h: "Build a structural model",
    p: "Physics-aware and uncertainty-aware — a predictive distribution, not a point estimate.",
  },
  {
    h: "Backtest with integrity checks",
    p: "Leak checks, shuffle tests, deflated Sharpe, discovery-acceleration factor. If it can't survive them, it isn't reported.",
  },
  {
    h: "Deliver an auditable decision",
    p: "A reproducible notebook (Colab / Kaggle) and a claim stated as rule, cost, capacity, and out-of-sample interval.",
  },
];

export default function FounderVoice() {
  const [contact, setContact] = useState<string | null>(null);

  return (
    <>
      <div className="mo-wrap">
        <section className="mkt-head fv-hero">
          <div className="fv-hero-left">
            <div className="mo-eyebrow">// Physics-AI for markets &amp; materials</div>
            <h1 className="mo-h1">
              Research
              <br />
              Services.
            </h1>
            <p className="mo-lede">
              We build custom physics-AI models for high-value prediction
              problems in markets and materials — calibrated, uncertainty-aware
              forecasts turned into auditable, economic decisions.
            </p>
          </div>
          <div className="fv-hero-right">
            <button
              type="button"
              className="btn-blk"
              onClick={() => setContact("Research Services inquiry")}
            >
              Get in touch →
            </button>
          </div>
        </section>
      </div>

      <div className="mo-ruler" />

      {/* what we handle */}
      <div className="mo-wrap">
        <section className="mo-features">
          <div className="mo-features-head">
            <span>// What we handle</span>
          </div>
          <div className="mo-axis" />
          <div className="area-grid">
            {AREAS.map((a) => (
              <article className="area-card" key={a.title}>
                <h2 className="mo-card-h">{a.title}</h2>
                <p className="mo-card-desc">{a.body}</p>
              </article>
            ))}
          </div>
          <div className="fv-cta-row">
            <button
              type="button"
              className="btn-blk"
              onClick={() => setContact("Research Services inquiry")}
            >
              Bring us a problem →
            </button>
          </div>
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
            {STEPS.map((s) => (
              <article className="mo-card" key={s.h}>
                <h3 className="mo-card-h">{s.h}</h3>
                <p className="mo-card-desc">{s.p}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {contact && (
        <ContactModal context={contact} onClose={() => setContact(null)} />
      )}
    </>
  );
}
