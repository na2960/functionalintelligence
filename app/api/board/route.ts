import { NextResponse } from "next/server";
import { fetchBoard } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const board = await fetchBoard();
    return NextResponse.json(board, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "board unavailable" }, { status: 500 });
  }
}
