import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/substack";

// Standalone email capture for the newsletter. Stores in Supabase (source of
// truth) and mirrors to Substack if configured. Returns a real error when the
// write fails, so signups can never silently disappear.
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const result = await subscribeEmail(body.email);
  if (!result.ok) {
    if (result.invalid) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Couldn't save that — please try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
