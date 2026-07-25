"use client";

import { Button } from "@/components/ui/Button";

export function RateSheet({
  onRate,
  onNext,
  title,
  subtitle,
  goodLabel,
  notGreatLabel,
  nextLabel,
}: {
  onRate: (value: "up" | "down") => void;
  onNext: () => void;
  title: string;
  subtitle: string;
  goodLabel: string;
  notGreatLabel: string;
  nextLabel: string;
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="rate-sheet-title"
      className="w-full max-w-md rounded-lg border border-border bg-surface1/90 p-5 text-center backdrop-blur-xl sm:p-6"
      style={{
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <h3
        id="rate-sheet-title"
        className="break-words font-display text-base font-semibold sm:text-lg"
      >
        {title}
      </h3>
      <p className="mx-auto mt-1 max-w-[92%] break-words text-sm text-muted sm:max-w-none">
        {subtitle}
      </p>

      <div className="mt-5 flex justify-center gap-3 sm:gap-4">
        <button
          onClick={() => onRate("up")}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface2 text-2xl transition-transform duration-fast hover:scale-105 active:scale-95"
          aria-label={goodLabel}
        >
          👍
        </button>
        <button
          onClick={() => onRate("down")}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface2 text-2xl transition-transform duration-fast hover:scale-105 active:scale-95"
          aria-label={notGreatLabel}
        >
          👎
        </button>
      </div>

      <Button size="lg" className="mt-6 p-1 w-full" onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
