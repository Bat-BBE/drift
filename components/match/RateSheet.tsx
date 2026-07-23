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
    <div className="w-full max-w-md rounded-lg bg-surface1/90 backdrop-blur-xl border border-border p-6 text-center">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-5 flex justify-center gap-4">
        <button
          onClick={() => onRate("up")}
          className="h-14 w-14 rounded-full bg-surface2 border border-border text-2xl transition-transform duration-fast hover:scale-105 active:scale-95"
          aria-label={goodLabel}
        >
          👍
        </button>
        <button
          onClick={() => onRate("down")}
          className="h-14 w-14 rounded-full bg-surface2 border border-border text-2xl transition-transform duration-fast hover:scale-105 active:scale-95"
          aria-label={notGreatLabel}
        >
          👎
        </button>
      </div>

      <Button size="lg" className="mt-6 w-full" onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
