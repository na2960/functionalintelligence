"use client";

import { useMarket } from "./MarketProvider";

export default function BoardActions() {
  const { openBackNew, openBackExisting, openCommission } = useMarket();
  return (
    <div className="board-actions">
      <button className="action primary" onClick={openBackNew}>
        <span className="action-ico">+</span>
        Back a new topic
      </button>
      <button className="action" onClick={() => openBackExisting()}>
        <span className="action-ico">▲</span>
        Back an existing topic
      </button>
      <button className="action" onClick={openCommission}>
        <span className="action-ico">✦</span>
        Commission a brief
      </button>
    </div>
  );
}
