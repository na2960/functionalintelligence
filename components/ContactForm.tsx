"use client";

import { useState } from "react";

// 30-minute slots, 9:00 AM – 5:00 PM — no odd minutes, no scrolling wheel.
const TIME_SLOTS: { value: string; label: string }[] = [];
for (let h = 9; h <= 17; h++) {
  for (const m of [0, 30]) {
    if (h === 17 && m === 30) break;
    const ampm = h < 12 ? "AM" : "PM";
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    TIME_SLOTS.push({
      value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      label: `${hr12}:${String(m).padStart(2, "0")} ${ampm}`,
    });
  }
}

export default function ContactForm({ context }: { context?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const parts: string[] = [];
      if (context) parts.push(`Regarding: ${context}`);
      if (date) {
        const slot = TIME_SLOTS.find((s) => s.value === time);
        const nice = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        parts.push(
          `Preferred call: ${nice}${slot ? ` at ${slot.label} ET` : ""}`
        );
      }
      if (message) parts.push(message);
      const fullMessage = parts.join("\n\n") || message;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: fullMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setName("");
      setEmail("");
      setDate("");
      setTime("");
      setMessage("");
      setMsg({
        ok: true,
        text: date
          ? "Sent — we'll confirm your call by email."
          : "Sent — we'll get back to you shortly.",
      });
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
      {context ? <div className="cf-context mono">Re: {context}</div> : null}
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">Name</span>
          <input
            type="text"
            maxLength={120}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="cf-field">
          <span className="cf-label">Email</span>
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

      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">Preferred day (optional)</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="cf-field">
          <span className="cf-label">Preferred time (ET)</span>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!date}
          >
            <option value="">Any time</option>
            {TIME_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="cf-field">
        <span className="cf-label">Message</span>
        <textarea
          required
          maxLength={4000}
          rows={4}
          placeholder="What can we help with?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <div className="cf-actions">
        <button type="submit" className="btn-blk" disabled={busy}>
          {busy ? "Sending…" : "Send →"}
        </button>
        {msg && (
          <span className={`cf-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</span>
        )}
      </div>
    </form>
  );
}
