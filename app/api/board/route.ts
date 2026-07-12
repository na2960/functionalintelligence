import { NextResponse } from "next/server";
import { fetchBoard } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ideas = await fetchBoard();
    return NextResponse.json(
      { ideas },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "board unavailable" }, { status: 500 });
  }
}
