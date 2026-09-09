import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EmailCapture from "@/components/EmailCapture";
import SubscribeButton from "@/components/SubscribeButton";
import { fetchBriefs, type Brief } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  biomed: "Biomedicine",
  markets: "Markets",
  materials: "Materials",
  "supply-chain": "Supply Chain",
  science: "Science",
  math: "Math",
  other: "Other",
};

export const metadata = {
  title: "Newsletter — Functional Intelligence",
  description:
    "Deep tech research and insights — hard ideas across the frontier, made legible. Free to read.",
};

function fmtDate(d: string | null) {
  return d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
}

export default async function NewsletterPage() {
  let posts: Brief[] = [];
  try {
    posts = await fetchBriefs();
  } catch {}

  return (
    <>
      <Nav active="newsletter" />

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Deep tech research &amp; insights</div>
          <h1 className="mo-h1">Newsletter.</h1>
          <p className="mo-lede">
            Deep tech research and insights — hard ideas across the frontier,
            made legible. Free to read.
          </p>
          <div className="mkt-head-actions">
            <SubscribeButton label="Follow — free" />
          </div>
        </section>
      </div>

      <div className="mo-ruler" />

      <div className="mo-wrap">
        <section className="mkt-current">
          <div className="mo-features-head">
            <span>// Notes</span>
            <span>{posts.length ? `${posts.length} published` : "Coming soon"}</span>
          </div>
          <div className="mo-axis" />

          {posts.length ? (
            <div className="news-list">
              {posts.map((p) => (
                <Link key={p.id} href={`/briefs/${p.id}`} className="news-item">
                  <div className="mkt-issue-meta mono">
                    <span className="mkt-tag">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                    <span>{fmtDate(p.covered_at)}</span>
                  </div>
                  <h2 className="mkt-issue-h">{p.title}</h2>
                  {p.detail ? <p className="mo-card-desc">{p.detail}</p> : null}
                  <span className="mo-link">Read the note →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mkt-issue mkt-issue-empty">
              <h2 className="mkt-issue-h">The first note ships soon.</h2>
              <p className="mo-card-desc">
                Follow along and it will land in your inbox.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mo-wrap">
        <section className="news-sub">
          <EmailCapture variant="band" cta="Sign up — free" />
        </section>
      </div>

      <Footer />
    </>
  );
}
