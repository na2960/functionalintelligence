"use client";

import { formatMoney } from "@/lib/market";

// Polymarket-style amount pills + custom entry.
export default function AmountPicker({
  presets,
  amountCents,
  custom,
  minCents,
  onPreset,
  onCustom,
}: {
  presets: number[];
  amountCents: number;
  custom: string;
  minCents: number;
  onPreset: (cents: number) => void;
  onCustom: (val: string) => void;
}) {
  return (
    <>
      <div className="amounts">
        {presets.map((c) => (
          <button
            type="button"
            key={c}
            className={`amt${!custom && amountCents === c ? " sel" : ""}`}
            onClick={() => onPreset(c)}
          >
            {formatMoney(c)}
          </button>
        ))}
      </div>
      <label className="f">
        Or a custom amount (USD)
        <div className="custom-amt">
          <span className="dollar">$</span>
          <input
            type="number"
            min={minCents / 100}
            max={1000}
            step={1}
            placeholder={`${minCents / 100} minimum`}
            value={custom}
            onChange={(e) => onCustom(e.target.value)}
          />
        </div>
      </label>
    </>
  );
}
