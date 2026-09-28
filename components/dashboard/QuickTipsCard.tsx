"use client";

import { useLocale } from "@/lib/i18n";

export function QuickTipsCard() {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl border border-border bg-surface1/70 p-4 backdrop-blur-xl">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <span aria-hidden>💡</span>
        {t.quickTipsTitle}
      </p>
      <ul className="mt-3 space-y-2">
        {t.safetyTips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-[13px] leading-relaxed text-muted"
          >
            <span aria-hidden className="mt-0.5 flex-none text-brand">
              ✓
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
