"use client";

import type { Theme } from "@/lib/theme";

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark/light mode"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface1/80 text-sm backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
