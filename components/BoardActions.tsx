"use client";

import { useMarket } from "./MarketProvider";

export default function BoardActions() {
  const { openBackNew } = useMarket();
  return (
    <div className="board-actions">
      <button className="action primary" onClick={openBackNew}>
        <span className="action-ico">+</span>
        Back a new topic
      </button>
      <a className="action" href="#commission">
        <span className="action-ico">✦</span>
        Private Commissions
      </a>
    </div>
  );
}
