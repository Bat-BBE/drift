"use client";

import { ZODIAC_SIGNS } from "@/lib/zodiac";

export function ZodiacPicker({
  onPick,
  onCancel,
  title,
  cancelLabel,
}: {
  onPick: (name: string) => void;
  onCancel: () => void;
  title: string;
  cancelLabel: string;
}) {
  return (
    <div className="w-full max-w-md rounded-lg bg-surface1/95 backdrop-blur-xl border border-border p-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {ZODIAC_SIGNS.map((z) => (
          <button
            key={z.name}
            onClick={() => onPick(z.name)}
            className="flex flex-col items-center gap-1 rounded-sm border border-border bg-surface2 py-3 text-xs transition-transform duration-fast hover:scale-105 active:scale-95"
          >
            <span className="text-xl">{z.emoji}</span>
            {z.name}
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="mt-4 w-full rounded-sm py-2 text-sm text-muted hover:text-foreground"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
