"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  DUEL_MOVES,
  resolveDuel,
  type DuelMove,
  type DuelRoundState,
} from "@/lib/duel";

export function DuelGame({
  round,
  onPickMove,
  onClose,
  onRematch,
}: {
  round: DuelRoundState;
  onPickMove: (move: DuelMove) => void;
  onClose: () => void;
  onRematch: () => void;
}) {
  const [localMove, setLocalMove] = useState<DuelMove | null>(null);
  const myMove = round.myMove ?? localMove;
  const { theirMove } = round;
  const bothPicked = !!myMove && !!theirMove;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setLocalMove(null);
  }, [round.roundId]);

  useEffect(() => {
    if (bothPicked) {
      const t = setTimeout(() => setRevealed(true), 700);
      return () => clearTimeout(t);
    }
    setRevealed(false);
  }, [bothPicked]);

  const result = bothPicked ? resolveDuel(myMove!, theirMove!) : null;

  function pickMove(move: DuelMove) {
    setLocalMove(move);
    onPickMove(move);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface1 p-5 text-center shadow-[0_8px_40px_rgba(124,92,255,0.15)]">
        <button
          onClick={onClose}
          aria-label="Гарах"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
        >
          ✕
        </button>

        <h3 className="font-display text-lg font-semibold">⚔️ Х~Ч~Д</h3>

        {!myMove && (
          <>
            <p className="mt-1 text-sm text-muted">Сонголтоо хий</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DUEL_MOVES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pickMove(m.id)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface2 py-3 text-xs transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </>
        )}

        {myMove && !bothPicked && (
          <div className="mt-4">
            <p className="text-sm text-muted">
              Сонголтоо хийлээ ✅ Нөгөө хүнийг хүлээж байна...
            </p>
            <p className="mt-1 text-xs text-muted">
              Та хүлээхгүйгээр гарч, дараа нь буцаж орж болно.
            </p>
          </div>
        )}

        {bothPicked && !revealed && (
          <p className="mt-4 animate-pulse text-sm text-muted">
            Хоёулаа сонгосон... 🥁
          </p>
        )}

        {bothPicked && revealed && (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-6 text-4xl">
              <span>{DUEL_MOVES.find((m) => m.id === myMove)?.emoji}</span>
              <span className="text-base text-muted">vs</span>
              <span>{DUEL_MOVES.find((m) => m.id === theirMove)?.emoji}</span>
            </div>
            <p className="mt-3 font-semibold">
              {result === "win" && "🎉 Та яллаа!"}
              {result === "lose" && "😅 Та хожигдлоо"}
              {result === "draw" && "🤝 Тэнцлээ"}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Хаах
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-brand to-brand-pink"
                onClick={onRematch}
              >
                Дахин тоглох
              </Button>
            </div>
          </div>
        )}

        {!bothPicked && (
          <button
            onClick={onClose}
            className="mt-4 rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            {myMove ? "Гарах" : "Цуцлах"}
          </button>
        )}
      </div>
    </div>
  );
}
