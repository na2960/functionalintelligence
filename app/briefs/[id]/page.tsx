import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BriefBody from "@/components/BriefBody";
import { fetchBrief } from "@/lib/supabase";

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

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let brief = null;
  try {
    brief = await fetchBrief(id);
  } catch {
    // fall through to notFound
  }
  if (!brief) notFound();

  return (
    <>
      <Nav active="briefs" />
      <main className="wrap">
        <article className="brief-page">
          <div className="brief-meta">
            <Link href="/briefs" className="back-link">
              ← All briefs
            </Link>
            <span className="chip">
              {CATEGORY_LABELS[brief.category] ?? brief.category}
            </span>
            {brief.covered_at ? (
              <span className="when">
                {new Date(brief.covered_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            ) : null}
          </div>
          <h1>{brief.title}</h1>
          {brief.brief_body ? (
            <BriefBody body={brief.brief_body} />
          ) : (
            <p className="section-sub">
              This brief lives on Substack — read it there:
            </p>
          )}
          {brief.brief_url ? (
            <p className="brief-substack">
              <a
                href={brief.brief_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy"
              >
                Read on Substack ↗
              </a>
            </p>
          ) : null}
          <div className="brief-cta">
            <span>Want the next one to be yours?</span>{" "}
            <Link href="/#board">Back an idea on The Board →</Link>
          </div>
        </article>
      </main>
    </>
  );
}
