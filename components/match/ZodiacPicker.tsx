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
    <div className="w-full max-w-md rounded-lg border border-border bg-surface1/95 p-4 backdrop-blur-xl sm:p-6">
      <h3 className="font-display text-base font-semibold sm:text-lg">
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-3 gap-2 xs:grid-cols-4">
        {ZODIAC_SIGNS.map((z) => (
          <button
            key={z.name}
            onClick={() => onPick(z.name)}
            className="flex min-w-0 flex-col items-center gap-1 rounded-sm border border-border bg-surface2 px-1 py-3 text-[11px] leading-tight transition-transform duration-fast hover:scale-105 active:scale-95 sm:text-xs"
          >
            <span className="text-xl">{z.emoji}</span>
            <span className="w-full truncate text-center">{z.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="mt-4 w-full rounded-sm py-2.5 text-sm text-muted hover:text-foreground active:opacity-70 sm:py-2"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
