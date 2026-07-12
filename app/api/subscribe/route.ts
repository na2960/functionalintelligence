import { NextRequest, NextResponse } from "next/server";
import { captureEmail } from "@/lib/substack";

// Standalone email capture for the newsletter. Stores in Supabase and
// mirrors to Substack (best-effort).
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const ok = await captureEmail(body.email, "site");
  if (!ok) {
    return NextResponse.json(
      { error: "Enter a valid email." },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}
