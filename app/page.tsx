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

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand/25 blur-[90px] animate-float" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-cyan/20 blur-[100px] animate-float [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-pink/20 blur-[90px] animate-float [animation-delay:4s]" />
      </div>

      <div className="relative z-10 flex flex-1 w-full max-w-xl flex-col items-center justify-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface1/80 px-3 py-1.5 text-xs text-muted backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {onlineCount === null
            ? t.onlineConnecting
            : t.onlineCount(onlineCount)}
        </span>

        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-brand via-brand-cyan to-brand-pink bg-clip-text text-transparent">
            {t.heroLine1}
          </span>
          <br />
          {t.heroLine2}
        </h1>
        <p className="mt-4 max-w-sm text-[15px] text-muted">{t.heroSubtitle}</p>

        {!showGate ? (
          <Button
            size="lg"
            className="mt-10 p-2 w-full max-w-xs bg-gradient-to-r from-brand to-brand-pink hover:brightness-110"
            onClick={() => setShowGate(true)}
          >
            {t.startChatting} ✦
          </Button>
        ) : (
          <div className="mt-10 w-full max-w-xs rounded-lg border border-border bg-surface1/90 p-5 text-left backdrop-blur-xl">
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
              <p className="mb-2 text-sm font-semibold">{t.safetyTitle}</p>
              <ul className="space-y-1 text-xs text-muted">
                {t.safetyTips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={ageConfirmed ? "/match" : "#"}
              aria-disabled={!ageConfirmed}
            >
              <Button
                size="lg"
                className="mt-4 p-2 w-full"
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
          <Link
            href="/friends"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface1/80 px-4 py-2 text-xs text-muted backdrop-blur-xl transition-colors hover:text-foreground"
          >
            {t.friendsTitle}
          </Link>
        </div>
      </div>
    </main>
  );
}
