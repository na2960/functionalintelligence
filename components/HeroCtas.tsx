"use client";

import { useMarket } from "./MarketProvider";

export default function HeroCtas() {
  const { openBackNew } = useMarket();
  return (
    <div className="cta-row">
      <a className="btn btn-gold" href="#board">
        See The Board →
      </a>
      <button className="btn btn-ghost" onClick={openBackNew}>
        Fund a topic →
      </button>
    </div>
  );
}
