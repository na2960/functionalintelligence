"use client";

import { useState } from "react";
import type { BoardIdea } from "@/lib/supabase";
import { formatMoney } from "@/lib/market";
import { CATEGORIES } from "@/lib/categories";
import Modal from "./Modal";
import AmountPicker from "./AmountPicker";

const PRESETS = [300, 500, 1000, 2500, 10000]; // $3 $5 $10 $25 $100
const MIN = 300;

export default function BackModal({
  mode,
  ideas,
  initialIdea,
  preset,
  onClose,
  onDone,
}: {
  mode: "new" | "existing";
  ideas: BoardIdea[];
  initialIdea?: BoardIdea | null;
  preset?: number;
  onClose: () => void;
  onDone: () => void;
}) {
  const open = ideas.filter((i) => i.status === "open");
  const [selectedId, setSelectedId] = useState(
    initialIdea?.id ?? open[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("other");
  const [detail, setDetail] = useState("");

  const [amountCents, setAmountCents] = useState(preset ?? 500);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const effectiveCents = custom ? Math.round(Number(custom) * 100) : amountCents;
  const selected = open.find((i) => i.id === selectedId) ?? null;

  async function submit() {
    if (mode === "new" && title.trim().length < 3) {
      setMsg({ ok: false, text: "Give the topic a title (3+ characters)." });
      return;
    }
    if (mode === "existing" && !selectedId) {
      setMsg({ ok: false, text: "Pick a topic to back." });
      return;
    }
    if (!Number.isFinite(effectiveCents) || effectiveCents < MIN) {
      setMsg({ ok: false, text: "Minimum backing is $3." });
      return;
    }
    if (effectiveCents > 100000) {
      setMsg({ ok: false, text: "Maximum single backing is $1,000." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const payload =
        mode === "new"
          ? {
              newTopic: {
                title: title.trim(),
                link: link.trim() || undefined,
                category,
                detail: detail.trim() || undefined,
              },
              amountCents: effectiveCents,
              name: name.trim() || undefined,
              email: email.trim() || undefined,
            }
          : {
              ideaId: selectedId,
              amountCents: effectiveCents,
              name: name.trim() || undefined,
              email: email.trim() || undefined,
            };
      const res = await fetch("/api/back", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      setMsg({
        ok: true,
        text: `You're on the board for ${formatMoney(
          effectiveCents
        )} — recorded as a launch pledge, no charge yet. Watch it climb.`,
      });
      setTimeout(onDone, 1800);
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
      title={mode === "new" ? "Back a new topic" : "Back a topic"}
      subtitle={
        mode === "new"
          ? "Put it on The Board and fund it in one move."
          : selected
          ? `${selected.title} · ${formatMoney(selected.total_cents)} in the pool`
          : undefined
      }
      onClose={onClose}
    >
      {mode === "new" ? (
        <>
          <label className="f">
            Topic / question
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
              Source link (optional)
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
          </div>
        </>
      ) : (
        <label className="f">
          Topic
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {open.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title} — {formatMoney(i.total_cents)}
              </option>
            ))}
          </select>
        </label>
      )}

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

      <div className="field-row">
        <label className="f">
          Name on the board (optional)
          <input
            type="text"
            maxLength={60}
            placeholder="anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="f">
          Email for the brief (optional)
          <input
            type="email"
            maxLength={200}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="dialog-actions">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-gold" onClick={submit} disabled={busy}>
          {busy
            ? "Working…"
            : `Back for ${formatMoney(
                Number.isFinite(effectiveCents) && effectiveCents > 0
                  ? effectiveCents
                  : 0
              )}`}
        </button>
      </div>

      <p className="pledge-note">
        Backing funds coverage — it prioritizes what gets explained. No wagers,
        no odds, no payouts. Every brief is free to read.
      </p>
      {msg && <p className={`form-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</p>}
    </Modal>
  );
}
