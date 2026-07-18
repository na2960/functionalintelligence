import { NextRequest, NextResponse } from "next/server";
import { serviceClient, publicClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact form intake. Stores the message in Supabase (service role preferred,
// anon insert policy as fallback). Reads are never exposed.
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 120) || null;
  const email = (body.email ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 4000);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json(
      { error: "Tell us a little more (5+ characters)." },
      { status: 400 }
    );
  }

  const supabase = serviceClient() ?? publicClient();
  const { error } = await supabase
    .from("fi_contact_messages")
    .insert({ name, email, message });

  if (error) {
    return NextResponse.json(
      { error: "Couldn't send that — please email us directly." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
