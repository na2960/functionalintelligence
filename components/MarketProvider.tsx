"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BoardIdea } from "@/lib/supabase";
import BackModal from "./BackModal";
import CommissionModal from "./CommissionModal";

type ModalState =
  | null
  | { type: "back-new" }
  | { type: "back-existing"; idea?: BoardIdea | null; preset?: number }
  | { type: "commission" };

type MarketCtx = {
  ideas: BoardIdea[];
  refresh: () => void;
  openBackNew: () => void;
  openBackExisting: (idea?: BoardIdea | null, preset?: number) => void;
  openCommission: () => void;
};

const Ctx = createContext<MarketCtx | null>(null);

export function useMarket() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMarket must be used within MarketProvider");
  return c;
}

export default function MarketProvider({
  initialIdeas,
  children,
}: {
  initialIdeas: BoardIdea[];
  children: React.ReactNode;
}) {
  const [ideas, setIdeas] = useState<BoardIdea[]>(initialIdeas);
  const [modal, setModal] = useState<ModalState>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/board", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.ideas)) setIdeas(data.ideas);
      }
    } catch {
      // keep last known board
    }
  }, []);

  useEffect(() => {
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, [refresh]);

  const value: MarketCtx = {
    ideas,
    refresh,
    openBackNew: () => setModal({ type: "back-new" }),
    openBackExisting: (idea, preset) =>
      setModal({ type: "back-existing", idea, preset }),
    openCommission: () => setModal({ type: "commission" }),
  };

  const close = () => setModal(null);
  const done = () => {
    setModal(null);
    refresh();
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {modal?.type === "back-new" && (
        <BackModal
          mode="new"
          ideas={ideas}
          onClose={close}
          onDone={done}
        />
      )}
      {modal?.type === "back-existing" && (
        <BackModal
          mode="existing"
          ideas={ideas}
          initialIdea={modal.idea}
          preset={modal.preset}
          onClose={close}
          onDone={done}
        />
      )}
      {modal?.type === "commission" && (
        <CommissionModal onClose={close} onDone={done} />
      )}
    </Ctx.Provider>
  );
}
