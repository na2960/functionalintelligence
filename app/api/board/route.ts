import { NextResponse } from "next/server";
import { fetchBoard, fetchRecentBackings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [ideas, recent] = await Promise.all([
      fetchBoard(),
      fetchRecentBackings(),
    ]);
    return NextResponse.json(
      { ideas, recent },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "board unavailable" }, { status: 500 });
  }
}
