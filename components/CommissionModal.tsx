"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/market";
import { CATEGORIES } from "@/lib/categories";
import Modal from "./Modal";
import AmountPicker from "./AmountPicker";

const PRESETS = [10000, 25000, 50000, 100000]; // $100 $250 $500 $1000
const MIN = 10000;

export default function CommissionModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ai");
  const [customCategory, setCustomCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [amountCents, setAmountCents] = useState(10000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const effectiveCents = custom ? Math.round(Number(custom) * 100) : amountCents;

  async function submit() {
    if (title.trim().length < 3) {
      setMsg({ ok: false, text: "Give the topic a title (3+ characters)." });
      return;
    }
    if (!email.trim()) {
      setMsg({ ok: false, text: "Email is required — that's where it goes." });
      return;
    }
    if (!Number.isFinite(effectiveCents) || effectiveCents < MIN) {
      setMsg({ ok: false, text: "Commissions start at $100." });
      return;
    }
    if (effectiveCents > 100000) {
      setMsg({ ok: false, text: "Maximum is $1,000." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          customCategory:
            category === "other" ? customCategory.trim() || undefined : undefined,
          detail: detail.trim() || undefined,
          amountCents: effectiveCents,
          name: name.trim() || undefined,
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      setMsg({
        ok: true,
        text: `Commission received — recorded as a launch pledge, no charge yet. Your brief will land at ${email.trim()}.`,
      });
      setTimeout(onDone, 2200);
    } catch (e) {
      setMsg({
        ok: false,
        text: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Commission a private brief"
      subtitle="Written for you, delivered to you first. It goes public only if you choose."
      onClose={onClose}
    >
      <label className="f">
        Topic / question
        <input
          type="text"
          maxLength={140}
          placeholder="Break down my lab's latest preprint"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <div className="field-row">
        <label className="f">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          Email (required)
          <input
            type="email"
            maxLength={200}
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      {category === "other" && (
        <label className="f">
          What field is this? (we&rsquo;ll review it)
          <input
            type="text"
            maxLength={80}
            placeholder="e.g. materials science, linguistics…"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        </label>
      )}
      <label className="f">
        What do you want answered? (optional)
        <textarea
          maxLength={1000}
          placeholder="Any angle, paper, or constraint you want the brief to hit."
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </label>

      <label className="f" style={{ marginBottom: 6 }}>
        Amount
      </label>
      <AmountPicker
        presets={PRESETS}
        amountCents={amountCents}
        custom={custom}
        minCents={MIN}
        onPreset={(c) => {
          setAmountCents(c);
          setCustom("");
        }}
        onCustom={setCustom}
      />

      <label className="f">
        Name (optional)
        <input
          type="text"
          maxLength={60}
          placeholder="Optional"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="dialog-actions">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-gold" onClick={submit} disabled={busy}>
          {busy
            ? "Working…"
            : `Commission for ${formatMoney(
                Number.isFinite(effectiveCents) && effectiveCents > 0
                  ? effectiveCents
                  : 0
              )}`}
        </button>
      </div>

      <p className="pledge-note">
        A commission is a private brief you fund directly — not a public bid on
        The Board. No odds, no payouts.
      </p>
      {msg && <p className={`form-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</p>}
    </Modal>
  );
}
