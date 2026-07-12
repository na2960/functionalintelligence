"use client";

import { useState } from "react";

export default function EmailCapture({
  variant = "band",
}: {
  variant?: "band" | "footer";
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setEmail("");
      setMsg({ ok: true, text: "You're on the list. First brief lands 7am." });
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={`email-capture ${variant}`} onSubmit={submit}>
      <div className="email-field">
        <input
          type="email"
          required
          maxLength={200}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={busy}>
          {busy ? "…" : "Subscribe"}
        </button>
      </div>
      {msg && (
        <span className={`email-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</span>
      )}
    </form>
  );
}
