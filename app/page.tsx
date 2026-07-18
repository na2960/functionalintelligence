import Footer from "@/components/Footer";
import Hub from "@/components/Hub";
import Nav from "@/components/Nav";
import { fetchBoard, fetchLatestBrief, type BoardIdea } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let board: BoardIdea[] = [];
  let latestBriefId: string | null = null;
  try {
    board = await fetchBoard();
  } catch {
    // marketplace falls back to empty; the client refreshes
  }
  try {
    const latest = await fetchLatestBrief();
    latestBriefId = latest?.id ?? null;
  } catch {
    // "Most recent brief" falls back to the briefs index
  }

  return (
    <>
      <Nav />
      <Hub board={board} latestBriefId={latestBriefId} />
      <Footer />
    </>
  );
}
