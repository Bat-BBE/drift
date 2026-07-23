"use client";

import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import type { Locale } from "@/lib/i18n";
import type { Theme } from "@/lib/theme";

export function TopControls({
  locale,
  onToggleLocale,
  theme,
  onToggleTheme,
}: {
  locale: Locale;
  onToggleLocale: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <LanguageToggle locale={locale} onToggle={onToggleLocale} />
    </div>
  );
}
