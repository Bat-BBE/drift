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

function MatchWeave() {
  return (
    <div
      className="pointer-events-none mx-auto mt-4 h-[130px] w-full max-w-[320px]"
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 100% at 50% 50%, #000 55%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 65% 100% at 50% 50%, #000 55%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <svg viewBox="-70 -30 140 60" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="weaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-primary, #7c5cff)" />
            <stop offset="100%" stopColor="var(--brand-cyan, #22d3ee)" />
          </linearGradient>
        </defs>
        <line
          x1="-9"
          y1="4"
          x2="9"
          y2="-4"
          stroke="url(#weaveGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="animate-weave-link"
        />
        <circle
          r="8"
          fill="none"
          stroke="var(--brand-cyan, #22d3ee)"
          strokeWidth="1.5"
          className="animate-weave-burst"
        />
        <circle r="4" className="fill-foreground opacity-90 animate-weave-a" />
        <circle r="4" className="fill-foreground opacity-90 animate-weave-b" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const onlineCount = usePresenceCount();
  const matchesToday = useMatchesToday();
  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-6 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-brand/25 blur-[110px]" />
        <div className="absolute right-[-140px] top-1/4 h-[420px] w-[420px] rounded-full bg-brand-cyan/15 blur-[120px]" />
        <div className="absolute bottom-[-120px] left-[8%] h-96 w-96 rounded-full bg-brand-pink/15 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%27120%27_height=%27120%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%272%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
      </div>
      <DriftField />

      <TopControls
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-1 flex-col items-center justify-center pt-6 text-center">
        <MatchWeave />

        <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface1/80 px-3.5 py-1.5 text-xs text-muted backdrop-blur-xl">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          {onlineCount === null
            ? t.onlineConnecting
            : t.onlineCount(onlineCount)}
        </span>

        <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.3] tracking-tight sm:text-6xl">
          <span className="text-foreground">{t.heroLine1}</span>
          <br />
          <span className="bg-gradient-to-r from-brand via-brand-cyan to-brand-pink bg-clip-text text-transparent">
            {t.heroLine2}
          </span>
        </h1>
        <p className="mx-auto mt-3.5 max-w-[320px] text-[15px] leading-relaxed text-muted">
          {t.heroSubtitle}
        </p>

        {!showGate ? (
          <button
            onClick={() => setShowGate(true)}
            className="mt-8 flex h-[54px] w-full max-w-[300px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-pink text-[15.5px] font-bold text-white shadow-[0_10px_40px_rgba(124,92,255,0.32)] transition-transform duration-fast hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            {t.startChatting} →
          </button>
        ) : (
          <div className="mt-8 w-full max-w-[340px] animate-bubble-in rounded-[24px] border border-border bg-gradient-to-b from-surface1/90 to-surface1/40 p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <h3 className="font-display text-sm font-bold">
              {t.beforeContinue}
            </h3>
            <p className="mt-1 text-xs text-muted">{t.gateHint}</p>

            <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-bold">
                <span aria-hidden>🛡️</span> {t.safetyTitle}
              </p>
              <ul className="space-y-1.5">
                {t.safetyTips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-[12px] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="flex-none text-amber-500">
                      ✓
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <label className="mt-4 flex items-start gap-3 text-[13.5px] text-muted">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-[17px] w-[17px] flex-none rounded border-border accent-[var(--brand-primary)]"
              />
              {t.ageConfirm}
            </label>

            <Link
              href={ageConfirmed ? "/match" : "#"}
              aria-disabled={!ageConfirmed}
              tabIndex={ageConfirmed ? 0 : -1}
            >
              <Button
                size="lg"
                className="mt-4 h-12 w-full rounded-2xl p-2 font-bold transition-transform duration-fast enabled:hover:scale-[1.015] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!ageConfirmed}
              >
                {t.continue}
              </Button>
            </Link>
          </div>
        )}

        <div className="relative mt-16 w-full max-w-2xl">
          <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
            {t.howItWorksTitle}
          </h2>

          <div className="relative mt-7 flex flex-col gap-3.5 sm:flex-row sm:gap-0">
            <div
              className="absolute left-6 top-3.5 bottom-3.5 w-px bg-gradient-to-b from-brand via-brand-cyan to-brand-pink opacity-30 sm:left-[8%] sm:right-[8%] sm:top-[23px] sm:bottom-auto sm:h-px sm:w-auto sm:bg-gradient-to-r"
              aria-hidden="true"
            />
            {[
              {
                num: "1",
                color: "text-brand",
                title: t.step1Title,
                desc: t.step1Desc,
              },
              {
                num: "2",
                color: "text-brand-cyan",
                title: t.step2Title,
                desc: t.step2Desc,
              },
              {
                num: "3",
                color: "text-brand-pink",
                title: t.step3Title,
                desc: t.step3Desc,
              },
            ].map((item) => (
              <div
                key={item.num}
                className="relative z-10 flex items-start gap-4 py-1 sm:flex-1 sm:flex-col sm:items-center sm:px-3 sm:text-center"
              >
                <div
                  className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border border-border bg-surface1 font-display text-[15px] font-bold ${item.color}`}
                >
                  {item.num}
                </div>
                <div className="sm:mt-3.5">
                  <h4 className="text-[15px] font-bold">{item.title}</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          {matchesToday !== null && matchesToday > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted">
              🔥 {t.matchesToday(matchesToday)}
            </span>
          )}
          <p className="mt-4 text-[13px] text-muted">{t.notDating}</p>
          <div className="mt-4">
            <ShareButton label={t.shareLabel} copiedLabel={t.shareCopied} />
          </div>
        </div>
      </div>
    </main>
  );
}
