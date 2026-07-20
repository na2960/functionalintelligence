import Link from "next/link";
import SubscribeButton, { BriefTimer } from "./SubscribeButton";

export default function Hub({ latestBriefId }: { latestBriefId: string | null }) {
  return (
    <main className="home">
      <div className="home-diagram">
        <div className="hm-axis" aria-hidden="true" />

        <section className="hm-box hm-tl">
          <h2 className="hm-h">Custom Research</h2>
          <p className="hm-desc">
            Well-researched, custom blueprints for your data model or problem
            statement, based on state-of-the-art peer-reviewed literature.
          </p>
          <Link href="/services" className="mo-link hm-link">
            Learn more →
          </Link>
          <span className="hm-conn hm-conn-r" aria-hidden="true" />
        </section>

        <section className="hm-box hm-mr">
          <span className="hm-conn hm-conn-l" aria-hidden="true" />
          <h2 className="hm-h">Research Marketplace</h2>
          <p className="hm-desc">
            Back any topic you want explained. The highest-backed idea becomes
            the subject of our next brief.
          </p>
          <Link href="/briefs" className="mo-link hm-link">
            Back a topic →
          </Link>
        </section>

        <section className="hm-box hm-bl">
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
          <span className="hm-conn hm-conn-r" aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}
