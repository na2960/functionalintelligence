import Footer from "@/components/Footer";
import Hub from "@/components/Hub";
import Nav from "@/components/Nav";
import { fetchLatestBrief } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let latestBriefId: string | null = null;
  try {
    const latest = await fetchLatestBrief();
    latestBriefId = latest?.id ?? null;
  } catch {
    // "Read latest" falls back to the briefs index
  }

  return (
    <>
      <Nav />
      <Hub latestBriefId={latestBriefId} />
      <Footer />
    </>
  );
}
