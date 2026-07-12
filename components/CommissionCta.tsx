"use client";

import { useMarket } from "./MarketProvider";

export default function CommissionCta() {
  const { openCommission } = useMarket();
  return (
    <button className="btn btn-ghost" onClick={openCommission}>
      Commission a brief →
    </button>
  );
}
