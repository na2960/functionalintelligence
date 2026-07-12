"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("other");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) {
      setMsg({ ok: false, text: "Give the idea a title (3+ characters)." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          link: link.trim() || undefined,
          category,
          detail: detail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setTitle("");
      setLink("");
      setDetail("");
      setMsg({
        ok: true,
        text: "You're on the board. Now put some weight behind it — ideas with $0 don't ship.",
      });
      router.refresh();
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
    <form className="panel" id="submit" onSubmit={submit}>
      <p className="hint">
        A paper link, a topic, a question. Anything from &ldquo;explain this
        Nature paper&rdquo; to &ldquo;why did the chip supply chain
        re-shore?&rdquo;
      </p>
      <label className="f">
        Title / question
        <input
          type="text"
          maxLength={140}
          placeholder="Explain the AlphaFold 3 paper like I'm smart but busy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <div className="field-row">
        <label className="f">
          Paper / source link (optional)
          <input
            type="url"
            maxLength={500}
            placeholder="https://…"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <label className="f">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="ai">AI</option>
            <option value="biomed">Biomedicine</option>
            <option value="markets">Markets</option>
            <option value="supply-chain">Supply Chain</option>
            <option value="science">Science</option>
            <option value="math">Math</option>
            <option value="other">Wildcard</option>
          </select>
        </label>
      </div>
      <label className="f">
        Why it matters (optional)
        <textarea
          maxLength={1000}
          placeholder="One or two lines on what you actually want answered."
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </label>
      <button className="btn btn-gold" type="submit" disabled={busy}>
        {busy ? "Submitting…" : "Add to The Board →"}
      </button>
      {msg && (
        <p className={`form-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</p>
      )}
    </form>
  );
}
