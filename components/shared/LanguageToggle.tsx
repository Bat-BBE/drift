"use client";

import { Locale } from "@/lib/i18n";

export function LanguageToggle({
  locale,
  onToggle,
}: {
  locale: Locale;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 rounded-full border border-border bg-surface1/80 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur-xl transition-colors hover:text-foreground"
      aria-label="Switch language"
    >
      <span className={locale === "mn" ? "text-success font-bold" : ""}>
        MN
      </span>
      <span className="opacity-30">/</span>
      <span className={locale === "en" ? "text-success font-bold" : ""}>
        EN
      </span>
    </button>
  );
}
