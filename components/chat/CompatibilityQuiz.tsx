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
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="mt-3 text-left">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-mono font-medium text-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full origin-left scale-x-0 rounded-full animate-quiz-bar-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px 0 ${color}66`,
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 bg-gradient-to-r from-brand to-brand-pink"
              : i < current
                ? "w-1.5 bg-brand/50"
                : "w-1.5 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function WaitingIndicator() {
  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 animate-quiz-check-pop">
        <span className="text-lg text-success">✓</span>
      </div>
      <p className="text-sm text-muted">Хариулт бүртгэгдлээ</p>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-brand animate-quiz-dot [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-brand-cyan animate-quiz-dot [animation-delay:160ms]" />
        <span className="h-2 w-2 rounded-full bg-brand-pink animate-quiz-dot [animation-delay:320ms]" />
      </div>
      <p className="text-xs text-muted">Нөгөө хүнийг хүлээж байна...</p>
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const iAnswered = !!myAnswers || locallySubmitted;
  const bothAnswered = !!myAnswers && !!theirAnswers;
  const result: CompatibilityResult | null = bothAnswered
    ? computeCompatibility(myAnswers!, theirAnswers!)
    : null;
  const leadingIsSoulmate = result ? result.soulmate >= result.friendly : true;

  function pick(optionId: string) {
    if (selectedId) return;
    setSelectedId(optionId);
    setTimeout(() => {
      const q = QUIZ_QUESTIONS[step];
      const next = { ...draft, [q.id]: optionId };
      setDraft(next);
      setSelectedId(null);
      if (step < QUIZ_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setLocallySubmitted(true);
        onAnswer(next);
      }
    }, 220);
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm animate-quiz-sheet-in rounded-2xl border border-border bg-surface1 p-5 text-center shadow-[0_20px_60px_rgba(124,92,255,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Хаах"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
        >
          ✕
        </button>

        <h3 className="font-display text-lg font-semibold">
          💫 Soulmate vs Friendly
        </h3>

        {!iAnswered && (
          <>
            <ProgressDots total={QUIZ_QUESTIONS.length} current={step} />

            <div key={step} className="animate-quiz-fade-in">
              <p className="mt-4 text-sm font-medium">
                {QUIZ_QUESTIONS[step].text}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {QUIZ_QUESTIONS[step].options.map((o) => {
                  const isSelected = selectedId === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => pick(o.id)}
                      disabled={!!selectedId}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "scale-[0.98] border-brand bg-brand/10"
                          : "border-border bg-surface2 hover:border-brand/60 hover:bg-surface2/80 active:scale-[0.98]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base transition-colors ${
                          isSelected ? "bg-brand/20" : "bg-surface1"
                        }`}
                      >
                        {o.emoji}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {iAnswered && !bothAnswered && (
          <>
            <WaitingIndicator />
            <button
              onClick={onClose}
              className="mt-4 rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
            >
              Гарах
            </button>
          </>
        )}

        {bothAnswered && result && (
          <div className="mt-3 animate-quiz-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 py-1 text-xs text-muted">
              {leadingIsSoulmate ? "💘" : "👯"}{" "}
              {leadingIsSoulmate
                ? "Soulmate тал руу хазайлаа"
                : "Friendly тал руу хазайлаа"}
            </span>

            <ResultBar
              label="💘 Soulmate"
              value={result.soulmate}
              color="var(--brand-pink, #ff6fa5)"
              delay={100}
            />
            <ResultBar
              label="👯 Friendly"
              value={result.friendly}
              color="var(--brand-cyan, #4fd1ff)"
              delay={250}
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
            className="mt-4 rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            Цуцлах
          </button>
        )}
      </div>
    </div>
  );
}
