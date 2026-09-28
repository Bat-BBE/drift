"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import {
  DUEL_MOVES,
  resolveDuel,
  type DuelMove,
  type DuelRoundState,
} from "@/lib/duel";

const WIN_CONFETTI = [
  { angle: -70, dist: 70, size: 6, color: "bg-brand", delay: 0 },
  { angle: -20, dist: 82, size: 5, color: "bg-brand-cyan", delay: 60 },
  { angle: 30, dist: 74, size: 6, color: "bg-brand-pink", delay: 30 },
  { angle: 80, dist: 80, size: 5, color: "bg-brand", delay: 90 },
  { angle: -130, dist: 76, size: 5, color: "bg-brand-cyan", delay: 45 },
  { angle: 155, dist: 70, size: 6, color: "bg-brand-pink", delay: 75 },
] as const;

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
  const { t } = useLocale();
  const [localMove, setLocalMove] = useState<DuelMove | null>(null);
  const myMove = round.myMove ?? localMove;
  const { theirMove } = round;
  const bothPicked = !!myMove && !!theirMove;
  const [revealed, setRevealed] = useState(false);

  const moveLabels: Record<DuelMove, string> = {
    rock: t.duelMoveRock,
    paper: t.duelMovePaper,
    scissors: t.duelMoveScissors,
  };

  useEffect(() => {
    setLocalMove(null);
  }, [round.roundId]);

  useEffect(() => {
    if (bothPicked) {
      const timer = setTimeout(() => setRevealed(true), 700);
      return () => clearTimeout(timer);
    }
    setRevealed(false);
  }, [bothPicked]);

  const result = bothPicked ? resolveDuel(myMove!, theirMove!) : null;

  function pickMove(move: DuelMove) {
    setLocalMove(move);
    onPickMove(move);
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={!myMove ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-sm animate-quiz-sheet-in rounded-2xl border border-border bg-surface1 p-5 text-center shadow-[0_20px_60px_rgba(124,92,255,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
        >
          ✕
        </button>

        <h3 className="font-display text-lg font-semibold">
          {t.duelGameTitle}
        </h3>

        {!myMove && (
          <>
            <p className="mt-1 text-sm text-muted">{t.duelPickPrompt}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DUEL_MOVES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pickMove(m.id)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface2 py-3 text-xs transition-transform duration-150 hover:scale-105 hover:border-brand/50 active:scale-95"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  {moveLabels[m.id]}
                </button>
              ))}
            </div>
          </>
        )}

        {myMove && !bothPicked && (
          <div className="mt-4 animate-quiz-fade-in">
            <p className="text-sm text-muted">{t.duelWaitingText}</p>
            <div
              className="mx-auto mt-3 flex items-center justify-center gap-1.5"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-brand animate-quiz-dot [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-brand-cyan animate-quiz-dot [animation-delay:160ms]" />
              <span className="h-2 w-2 rounded-full bg-brand-pink animate-quiz-dot [animation-delay:320ms]" />
            </div>
            <p className="mt-3 text-xs text-muted">{t.duelWaitingHint}</p>
          </div>
        )}

        {bothPicked && !revealed && (
          <p className="mt-4 animate-pulse text-sm text-muted">
            {t.duelBothPickedText}
          </p>
        )}

        {bothPicked && revealed && (
          <div className="mt-4 animate-quiz-fade-in">
            <div className="relative flex items-center justify-center gap-6 text-4xl">
              {result === "win" &&
                WIN_CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    className={`absolute left-1/2 top-1/2 rounded-full ${c.color} animate-match-confetti motion-reduce:hidden`}
                    style={
                      {
                        width: c.size,
                        height: c.size,
                        animationDelay: `${c.delay}ms`,
                        "--tx": `${Math.cos((c.angle * Math.PI) / 180) * c.dist}px`,
                        "--ty": `${Math.sin((c.angle * Math.PI) / 180) * c.dist}px`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              <span>{DUEL_MOVES.find((m) => m.id === myMove)?.emoji}</span>
              <span className="text-base text-muted">vs</span>
              <span>{DUEL_MOVES.find((m) => m.id === theirMove)?.emoji}</span>
            </div>
            <p className="mt-3 font-semibold">
              {result === "win" && t.duelResultWin}
              {result === "lose" && t.duelResultLose}
              {result === "draw" && t.duelResultDraw}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                {t.close}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-brand to-brand-pink"
                onClick={onRematch}
              >
                {t.duelRematch}
              </Button>
            </div>
          </div>
        )}

        {!bothPicked && (
          <button
            onClick={onClose}
            className="mt-4 rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            {myMove ? t.duelExit : t.cancel}
          </button>
        )}
      </div>
    </div>
  );
}
