"use client";

import { cn } from "@/lib/utils";

export function StreakBadge({
  streak,
  milestone,
}: {
  streak: number;
  milestone: number | null;
}) {
  if (streak < 2) return null;

  return (
    <div className="relative shrink-0">
      <span
        className={cn(
          "flex items-center gap-1 rounded-full border border-border bg-surface2 px-2 py-1 text-xs font-medium text-foreground transition-transform",
          milestone && "scale-110",
        )}
      >
        🔥 <span className="font-mono">{streak}</span>
      </span>

      {milestone && (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 animate-bubble-in rounded-lg border border-border bg-surface1 px-3 py-2 text-center text-xs shadow-[0_8px_40px_rgba(124,92,255,0.15)]">
          <span className="font-semibold text-brand">
            🔥 {milestone} streak!
          </span>
          <p className="mt-0.5 text-muted">Сайхан яриа өрнөж байгаа бололтой</p>
        </div>
      )}
    </div>
  );
}
