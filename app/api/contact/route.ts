import { NextRequest, NextResponse } from "next/server";
import { serviceClient, publicClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort email notification via Resend. Guarded by RESEND_API_KEY so the
// form still works (and still stores to Supabase) if email isn't configured.
async function notifyByEmail(msg: {
  name: string | null;
  email: string;
  message: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to =
    process.env.CONTACT_NOTIFY_EMAIL ??
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    "contact@funcimarket.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Functional Intelligence <hello@funcimarket.com>";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: msg.email,
        subject: `Contact form — ${msg.name ?? msg.email}`,
        text: `From: ${msg.name ?? "(no name)"} <${msg.email}>\n\n${msg.message}`,
      }),
    });
  } catch {
    // never blocks the submission — the row is already saved
  }
}

// Contact form intake. Stores the message in Supabase (service role preferred,
// anon insert policy as fallback) and best-effort emails a notification.
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

  // Notify by email if configured; the saved row is the source of truth.
  await notifyByEmail({ name, email, message });

  return NextResponse.json({ ok: true });
}
