import { publicClient } from "@/lib/supabase";

const SUBSTACK_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL ??
  "https://functionalintelligence.substack.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string | undefined | null): string | null {
  const e = (raw ?? "").trim().toLowerCase();
  if (!e || e.length > 200 || !EMAIL_RE.test(e)) return null;
  return e;
}

// Best-effort: subscribe an email to the Substack publication. Substack has
// no official public API, so this hits the same endpoint the embed form uses
// and may be rejected (captcha/rate limit). We never throw — the Supabase
// record is the source of truth; Substack is a nice-to-have sync.
async function pushToSubstack(email: string): Promise<void> {
  try {
    const base = SUBSTACK_URL.replace(/\/+$/, "");
    const res = await fetch(`${base}/api/v1/free`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `${base}/`,
        Origin: base,
      },
      body: JSON.stringify({
        email,
        first_url: `${base}/`,
        first_referrer: "",
        current_url: `${base}/`,
        current_referrer: "",
        referral_code: "",
        source: "embed",
      }),
    });
    // Swallow non-2xx silently; we tried.
    void res.status;
  } catch {
    // network/DNS/captcha — ignore, Supabase already has the email.
  }
}

// Store an email in Supabase (idempotent) and mirror it to Substack.
// Returns true if the email was valid/stored, false if it looked invalid.
export async function captureEmail(
  raw: string | undefined | null,
  source = "site"
): Promise<boolean> {
  const email = normalizeEmail(raw);
  if (!email) return false;
  try {
    const supabase = publicClient();
    // upsert-by-unique: ignore duplicate emails without erroring.
    await supabase
      .from("fi_subscribers")
      .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
  } catch {
    // don't block the user flow on a subscribers write failure
  }
  await pushToSubstack(email);
  return true;
}
