import Link from "next/link";
import type { Brief } from "@/lib/supabase";

export default function LatestBrief({ brief }: { brief: Brief | null }) {
  if (!brief) {
    return (
      <section className="frame-sec latest latest-empty">
        <div className="latest-eyebrow">This week</div>
        <h2>The first brief ships Tuesday.</h2>
        <p>
          Every Tuesday at 7am we take one hard topic and break it down to its
          underlying assumptions. Fund a topic below, or get it in your inbox.
        </p>
      </section>
    );
  }

  const when = brief.covered_at
    ? new Date(brief.covered_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <section className="frame-sec latest">
      <div className="latest-eyebrow">Latest brief{when ? ` · ${when}` : ""}</div>
      <Link href={`/briefs/${brief.id}`} className="latest-card">
        <h2>{brief.title}</h2>
        {brief.detail ? <p>{brief.detail}</p> : null}
        <span className="read-more">Read the brief →</span>
      </Link>
    </section>
  );
}
