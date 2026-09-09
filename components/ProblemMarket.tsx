"use client";

import { useState } from "react";
import { PROBLEMS, DOMAINS } from "@/lib/problems";
import ContactModal from "./ContactModal";

export default function ProblemMarket() {
  const [contact, setContact] = useState<string | null>(null);

  return (
    <>
      {DOMAINS.map((domain, di) => {
        const items = PROBLEMS.filter((p) => p.domain === domain);
        return (
          <div className="mo-wrap" key={domain}>
            <section className="mo-features pm-section">
              <div className="mo-features-head">
                <span>// {domain}</span>
                <span>
                  {String(di + 1).padStart(2, "0")} / {DOMAINS.length}
                </span>
              </div>
              <div className="mo-axis" />
              <div className="pm-grid">
                {items.map((p) => (
                  <article className="pm-card" key={p.id}>
                    <h3 className="pm-title">{p.title}</h3>
                    <p className="pm-value">{p.value}</p>
                    <p className="pm-detail">{p.detail}</p>
                    <button
                      type="button"
                      className="mo-link pm-cta"
                      onClick={() => setContact(p.title)}
                    >
                      Discuss this problem →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        );
      })}

      {contact && (
        <ContactModal
          context={`Marketplace — ${contact}`}
          onClose={() => setContact(null)}
        />
      )}
    </>
  );
}
