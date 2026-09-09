import Link from "next/link";
import SubscribeButton from "./SubscribeButton";

export default function Hub({ latestBriefId }: { latestBriefId: string | null }) {
  return (
    <main className="home">
      <div className="home-diagram">
        <div className="hm-axis" aria-hidden="true" />

        <section className="hm-box hm-tl">
          <h2 className="hm-h">Research Services</h2>
          <p className="hm-desc">
            Custom physics-AI models for high-value prediction in markets and
            materials — calibrated forecasts turned into auditable decisions.
          </p>
          <Link href="/services" className="mo-link hm-link">
            Learn more →
          </Link>
          <span className="hm-conn hm-conn-r" aria-hidden="true" />
        </section>

        <section className="hm-box hm-mr">
          <span className="hm-conn hm-conn-l" aria-hidden="true" />
          <h2 className="hm-h">Marketplace</h2>
          <p className="hm-desc">
            The top-valued, specifically-named problems we work on across
            finance, energy, and materials design.
          </p>
          <Link href="/marketplace" className="mo-link hm-link">
            See the problems →
          </Link>
        </section>

        <section className="hm-box hm-bl">
          <h2 className="hm-h">Newsletter</h2>
          <p className="hm-desc">
            Deep tech research and insights — hard ideas, made legible. Free to
            read.
          </p>
          <div className="hm-actions">
            <Link
              href={latestBriefId ? `/briefs/${latestBriefId}` : "/briefs"}
              className="mo-link hm-link"
            >
              Read latest →
            </Link>
            <SubscribeButton label="Follow" />
          </div>
          <span className="hm-conn hm-conn-r" aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}
