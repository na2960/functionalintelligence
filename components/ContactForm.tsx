"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setName("");
      setEmail("");
      setMessage("");
      setMsg({ ok: true, text: "Sent — we'll get back to you shortly." });
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
    <form className="cf" onSubmit={submit}>
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">01 / Name</span>
          <input
            type="text"
            maxLength={120}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="cf-field">
          <span className="cf-label">02 / Email</span>
          <input
            type="email"
            required
            maxLength={200}
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <label className="cf-field">
        <span className="cf-label">03 / Message</span>
        <textarea
          required
          maxLength={4000}
          rows={6}
          placeholder="What can we help with?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <div className="cf-actions">
        <button type="submit" className="btn-blk" disabled={busy}>
          {busy ? "Sending…" : "Send message →"}
        </button>
        {msg && (
          <span className={`cf-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</span>
        )}
      </div>
    </form>
  );
}
