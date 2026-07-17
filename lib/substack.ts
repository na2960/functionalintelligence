import { publicClient, serviceClient } from "@/lib/supabase";

// Substack sync is opt-in: only when NEXT_PUBLIC_SUBSTACK_URL is set. Left
// unset, the site is fully self-contained — emails live only in Supabase.
const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim();

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
  if (!SUBSTACK_URL) return; // Substack disabled unless explicitly configured
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
    void res.status;
  } catch {
    // network/DNS/captcha — ignore, Supabase already has the email.
  }
}

// Write the subscriber row. captureEmail/subscribeEmail are only ever called
// from server-side API routes, so this uses the service role (bypasses RLS,
// same as the Stripe webhook) and falls back to the anon client. Unlike
// before, a store failure is logged and reported rather than swallowed.
async function storeSubscriber(
  email: string,
  source: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = serviceClient() ?? publicClient();
  const { error } = await supabase
    .from("fi_subscribers")
    .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("[subscribers] store failed:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

// Newsletter signup: store + best-effort Substack, surfacing real failures so
// the endpoint can return an error instead of a false success.
export async function subscribeEmail(
  raw: string | undefined | null
): Promise<{ ok: boolean; invalid?: boolean; error?: string }> {
  const email = normalizeEmail(raw);
  if (!email) return { ok: false, invalid: true };
  const stored = await storeSubscriber(email, "site");
  await pushToSubstack(email);
  return stored;
}

// Fund/commission flows: capture the email without blocking the payment.
// Returns true only if the email looked valid (store errors are logged).
export async function captureEmail(
  raw: string | undefined | null,
  source = "site"
): Promise<boolean> {
  const email = normalizeEmail(raw);
  if (!email) return false;
  await storeSubscriber(email, source);
  await pushToSubstack(email);
  return true;
}
