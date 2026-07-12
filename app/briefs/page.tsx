import Link from "next/link";
import Nav from "@/components/Nav";
import { fetchBriefs, type Brief } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  biomed: "Biomedicine",
  markets: "Markets",
  "supply-chain": "Supply Chain",
  science: "Science",
  math: "Math",
  other: "Wildcard",
};

export const metadata = {
  title: "Briefs — Functional Intelligence",
  description:
    "Every brief the board has shipped. 5 minutes each, free to read.",
};

export default async function Briefs() {
  let briefs: Brief[] = [];
  try {
    briefs = await fetchBriefs();
  } catch {
    // show the empty state rather than a 500
  }

  return (
    <>
      <Nav active="briefs" />
      <main className="wrap">
        <section>
          <div className="section-head">
            <h2>Briefs</h2>
          </div>
          <p className="section-sub">
            Every issue starts as an idea on The Board. The most-funded one
            ships Tuesday &amp; Thursday at 7:00 AM ET — and lands here.
          </p>

          {briefs.length === 0 ? (
            <div className="empty-briefs">
              <div className="empty-mark">
                <em>f</em> i
              </div>
              <h3>The first brief ships soon.</h3>
              <p>
                The board decides what it is.{" "}
                <Link href="/#board">Put your money on an idea →</Link>
              </p>
            </div>
          ) : (
            <div className="brief-list">
              {briefs.map((b) => (
                <Link
                  key={b.id}
                  href={`/briefs/${b.id}`}
                  className="brief-card"
                >
                  <div className="brief-card-top">
                    <span className="chip">
                      {CATEGORY_LABELS[b.category] ?? b.category}
                    </span>
                    <span className="when">
                      {b.covered_at
                        ? new Date(b.covered_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <h3>{b.title}</h3>
                  {b.detail ? <p>{b.detail}</p> : null}
                  <span className="read-more">Read the brief →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
