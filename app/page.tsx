"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TopControls } from "@/components/shared/TopControls";
import { usePresenceCount } from "@/hooks/usePresenceCount";
import { useMatchesToday } from "@/hooks/useMatchesToday";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { ShareButton } from "@/components/shared/ShareButton";
import { DriftField } from "@/components/landing/DriftField";

export default function LandingPage() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const onlineCount = usePresenceCount();
  const matchesToday = useMatchesToday();
  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-16">
      <TopControls
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <DriftField />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-brand/15 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-cyan/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex flex-1 w-full max-w-xl flex-col items-center justify-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface1/80 px-3 py-1.5 text-xs text-muted backdrop-blur-xl">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          {onlineCount === null
            ? t.onlineConnecting
            : t.onlineCount(onlineCount)}
        </span>

        <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-brand via-brand-cyan to-brand-pink bg-clip-text text-transparent">
            {t.heroLine1}
          </span>
          <br />
          <span className="text-foreground">{t.heroLine2}</span>
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          {t.heroSubtitle}
        </p>

        {!showGate ? (
          <Button
            size="lg"
            className="mt-10 w-full max-w-xs bg-gradient-to-r from-brand to-brand-pink p-2 shadow-[0_8px_40px_rgba(124,92,255,0.25)] transition-transform duration-fast hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            onClick={() => setShowGate(true)}
          >
            {t.startChatting} ✦
          </Button>
        ) : (
          <div className="mt-10 w-full max-w-xs animate-bubble-in rounded-lg border border-border bg-surface1/90 p-5 text-left shadow-[0_8px_40px_rgba(124,92,255,0.12)] backdrop-blur-xl">
            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--brand-primary)]"
              />
              {t.ageConfirm}
            </label>
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <span aria-hidden>🛡️</span> {t.safetyTitle}
              </p>
              <ul className="space-y-1.5 text-xs text-muted">
                {t.safetyTips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span aria-hidden className="text-amber-500">
                      ✓
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={ageConfirmed ? "/match" : "#"}
              aria-disabled={!ageConfirmed}
              tabIndex={ageConfirmed ? 0 : -1}
            >
              <Button
                size="lg"
                className="mt-4 w-full p-2 transition-transform duration-fast enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!ageConfirmed}
              >
                {t.continue}
              </Button>
            </Link>
          </div>
        )}

        {matchesToday !== null && matchesToday > 0 && (
          <p className="mt-4 text-xs text-muted">
            {t.matchesToday(matchesToday)}
          </p>
        )}
        <p className="mt-6 text-xs text-muted">{t.notDating}</p>
        <div className="mt-4 flex items-center gap-3">
          <ShareButton label={t.shareLabel} copiedLabel={t.shareCopied} />
        </div>
      </div>
    </main>
  );
}
