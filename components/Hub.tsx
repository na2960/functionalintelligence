import Link from "next/link";
import SubscribeButton, { BriefTimer } from "./SubscribeButton";

// build an SVG sine path across a viewBox
function sinePath(w: number, h: number, amp: number, cycles: number, phase = 0) {
  const mid = h / 2;
  const steps = 120;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = mid + amp * Math.sin((i / steps) * cycles * Math.PI * 2 + phase);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

function Join() {
  return (
    <div className="hm-join" aria-hidden="true">
      <span className="hm-node" />
      <span className="hm-line" />
      <span className="hm-node" />
    </div>
  );
}

export default function Hub({ latestBriefId }: { latestBriefId: string | null }) {
  return (
    <main className="home">
      {/* brand waveform in its dotted frame */}
      <div className="home-mark">
        <div className="mo-diagram" aria-hidden="true">
          <svg viewBox="0 0 900 140" fill="none" preserveAspectRatio="none">
            <line
              x1="0"
              y1="70"
              x2="900"
              y2="70"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
            <path
              d={sinePath(900, 140, 42, 5.4, 0)}
              stroke="var(--line)"
              strokeWidth="1.5"
            />
            <path
              d={sinePath(900, 140, 28, 8.6, 1.1)}
              stroke="var(--line)"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* three modules connected to a shared dotted axis */}
      <div className="home-modules">
        <section className="hm-box">
          <span className="hm-idx">01</span>
          <h2 className="hm-h">Writing Services</h2>
          <p className="hm-desc">
            Technical content, written in your voice and published under your
            name. Our involvement stays private.
          </p>
          <Link href="/services" className="mo-link hm-link">
            Learn more →
          </Link>
        </section>

        <Join />

        <section className="hm-box">
          <span className="hm-idx">02</span>
          <h2 className="hm-h">Research Marketplace</h2>
          <p className="hm-desc">
            Back a topic you want explained. The highest-backed idea becomes the
            subject of our next brief.
          </p>
          <Link href="/briefs" className="mo-link hm-link">
            Back a topic →
          </Link>
        </section>

        <Join />

        <section className="hm-box">
          <span className="hm-idx">03</span>
          <h2 className="hm-h">Briefs</h2>
          <p className="hm-desc">
            A weekly brief that breaks hard ideas down for clear understanding.
            Every Tuesday, 7am ET — free.
          </p>
          <BriefTimer />
          <div className="hm-actions">
            <Link
              href={latestBriefId ? `/briefs/${latestBriefId}` : "/briefs"}
              className="mo-link hm-link"
            >
              Read latest →
            </Link>
            <SubscribeButton />
          </div>
        </section>
      </div>
    </main>
  );
}
