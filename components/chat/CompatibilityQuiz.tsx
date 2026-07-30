"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  QUIZ_QUESTIONS,
  computeCompatibility,
  type QuizAnswers,
  type CompatibilityResult,
} from "@/lib/compatibility";

function ResultBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="mt-3 text-left">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-mono font-medium text-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function CompatibilityQuiz({
  myAnswers,
  theirAnswers,
  onAnswer,
  onClose,
}: {
  myAnswers: QuizAnswers | null;
  theirAnswers: QuizAnswers | null;
  onAnswer: (answers: QuizAnswers) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuizAnswers>({});
  const [locallySubmitted, setLocallySubmitted] = useState(false);

  const iAnswered = !!myAnswers || locallySubmitted;
  const bothAnswered = !!myAnswers && !!theirAnswers;
  const result: CompatibilityResult | null = bothAnswered
    ? computeCompatibility(myAnswers!, theirAnswers!)
    : null;

  function pick(optionId: string) {
    const q = QUIZ_QUESTIONS[step];
    const next = { ...draft, [q.id]: optionId };
    setDraft(next);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setLocallySubmitted(true);
      onAnswer(next);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface1 p-5 text-center shadow-[0_8px_40px_rgba(124,92,255,0.15)]">
        <h3 className="font-display text-lg font-semibold">
          💫 Soulmate vs Friendly
        </h3>

        {!iAnswered && (
          <>
            <p className="mt-1 text-xs text-muted">
              Асуулт {step + 1} / {QUIZ_QUESTIONS.length}
            </p>
            <p className="mt-3 text-sm font-medium">
              {QUIZ_QUESTIONS[step].text}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {QUIZ_QUESTIONS[step].options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => pick(o.id)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface2 px-3 py-2.5 text-left text-sm transition-colors hover:border-brand hover:bg-surface2/80"
                >
                  <span className="text-lg">{o.emoji}</span> {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {iAnswered && !bothAnswered && (
          <p className="mt-4 text-sm text-muted">
            Хариулт бүртгэгдлээ ✅ Нөгөө хүнийг хүлээж байна...
          </p>
        )}

        {bothAnswered && result && (
          <div className="mt-2">
            <ResultBar
              label="💘 Soulmate"
              value={result.soulmate}
              color="var(--brand-pink, #ff6fa5)"
            />
            <ResultBar
              label="👯 Friendly"
              value={result.friendly}
              color="var(--brand-cyan, #4fd1ff)"
            />
            <p className="mt-4 text-sm text-foreground">{result.fact}</p>
            <Button
              size="lg"
              className="mt-5 w-full bg-gradient-to-r from-brand to-brand-pink"
              onClick={onClose}
            >
              Хаах
            </Button>
          </div>
        )}

        {!iAnswered && (
          <button
            onClick={onClose}
            className="mt-4 text-xs text-muted hover:text-foreground"
          >
            Цуцлах
          </button>
        )}
      </div>
    </div>
  );
}
