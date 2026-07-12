"use client";

import { useState } from "react";
import type { BoardIdea } from "@/lib/supabase";
import { formatMoney } from "@/lib/market";

const PRESETS = [300, 500, 1000, 2500, 10000];

export default function BackDialog({
  idea,
  onClose,
  onBacked,
}: {
  idea: BoardIdea;
  onClose: () => void;
  onBacked: () => void;
}) {
  const [amountCents, setAmountCents] = useState(500);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [commission, setCommission] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const effectiveCents = custom
    ? Math.round(Number(custom) * 100)
    : amountCents;
  const commissionEligible = effectiveCents >= 10000;

  async function submit() {
    if (!Number.isFinite(effectiveCents) || effectiveCents < 100) {
      setMsg({ ok: false, text: "Minimum backing is $1." });
      return;
    }
    if (effectiveCents > 100000) {
      setMsg({ ok: false, text: "Maximum single backing is $1,000." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/back", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          amountCents: effectiveCents,
          name: name.trim() || undefined,
          commission: commission && commissionEligible,
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
        text: `You're on the board for ${formatMoney(effectiveCents)}. Watch it climb.`,
      });
      setTimeout(onBacked, 1600);
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
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Back this idea</h3>
        <div className="idea-ref">{idea.title}</div>

        <label className="f">Amount</label>
        <div className="amounts">
          {PRESETS.map((c) => (
            <button
              key={c}
              className={`amt${!custom && amountCents === c ? " sel" : ""}`}
              onClick={() => {
                setAmountCents(c);
                setCustom("");
              }}
            >
              ${c / 100}
            </button>
          ))}
        </div>
        <label className="f">
          Or a custom amount (USD)
          <input
            type="number"
            min={1}
            max={1000}
            step={1}
            placeholder="e.g. 42"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </label>
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

        {commissionEligible && (
          <label className="commission-opt">
            <input
              type="checkbox"
              checked={commission}
              onChange={(e) => setCommission(e.target.checked)}
            />
            <span>
              <strong>Make it a Commission.</strong> At $100+, this becomes a
              private brief — written for you, delivered to you first. It goes
              public only if you choose.
            </span>
          </label>
        )}

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
          Backing funds coverage — it prioritizes what gets explained. No
          wagers, no odds, no payouts. Every brief is free to read.
        </p>
        {msg && (
          <p className={`form-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</p>
        )}
      </div>
    </div>
  );
}
