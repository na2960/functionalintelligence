import { NextResponse } from "next/server";
import { serviceClient, publicClient } from "@/lib/supabase";

// Keep-alive: Supabase free-tier projects pause after ~7 days without any
// requests. A scheduled GET here (Vercel Cron + a GitHub Action) touches the
// database daily so it never pauses. A read alone counts as activity; we also
// stamp a heartbeat row when the service key is available.
export const dynamic = "force-dynamic";

export async function GET() {
  const at = new Date().toISOString();
  let wrote = false;

  const svc = serviceClient();
  if (svc) {
    const { error } = await svc
      .from("fi_heartbeat")
      .upsert({ id: 1, beat_at: at, source: "cron" }, { onConflict: "id" });
    wrote = !error;
  }

  // Always issue a real read so the project registers activity even without
  // the service key configured.
  let read = false;
  try {
    const { error } = await publicClient()
      .from("fi_ideas")
      .select("id")
      .limit(1);
    read = !error;
  } catch {
    read = false;
  }

  return NextResponse.json(
    { ok: read || wrote, wrote, read, at },
    { headers: { "cache-control": "no-store" } }
  );
}
