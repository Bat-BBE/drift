"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/nav/AppShell";
import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useRecentChats } from "@/hooks/useRecentChats";
import {
  getBlockedUsers,
  unblockUser,
  type BlockedUser,
} from "@/lib/blocking";
import { useLocale, type Locale } from "@/lib/i18n";
import { useTheme, type Theme } from "@/lib/theme";

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface1/60 p-5">
      <h2 className="text-sm font-bold">{title}</h2>
      {desc && <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SegmentedButton<T extends string>({
  value,
  current,
  onClick,
  children,
}: {
  value: T;
  current: T;
  onClick: (v: T) => void;
  children: React.ReactNode;
}) {
  const active = value === current;
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-brand text-white"
          : "bg-surface2 text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const { userId } = useAnonymousAuth();
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { clearRecentChats } = useRecentChats();
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getBlockedUsers(userId).then(setBlocked);
  }, [userId]);

  async function handleUnblock(blockedId: string) {
    if (!userId) return;
    setBlocked((prev) => prev.filter((b) => b.blockedId !== blockedId));
    await unblockUser(userId, blockedId);
  }

  function handleClearRecent() {
    clearRecentChats();
    setCleared(true);
    setTimeout(() => setCleared(false), 1800);
  }

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl space-y-5 px-6 py-10 lg:px-10">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {t.settingsTitle}
          </h1>
          {userId && (
            <div className="mt-3 flex items-center gap-2.5">
              <Avatar id={userId} size={38} />
              <div>
                <p className="text-sm font-medium">
                  {getAvatar(userId).name}
                </p>
                <p className="text-xs text-muted">{t.availableStatus}</p>
              </div>
            </div>
          )}
        </div>

        <SectionCard
          title={t.settingsAppearanceTitle}
          desc={t.settingsAppearanceDesc}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t.settingsThemeLabel}
          </p>
          <div className="mt-2 flex gap-2">
            <SegmentedButton<Theme>
              value="dark"
              current={theme}
              onClick={() => theme !== "dark" && toggleTheme()}
            >
              🌙 {t.settingsThemeDark}
            </SegmentedButton>
            <SegmentedButton<Theme>
              value="light"
              current={theme}
              onClick={() => theme !== "light" && toggleTheme()}
            >
              ☀️ {t.settingsThemeLight}
            </SegmentedButton>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
            {t.settingsLanguageLabel}
          </p>
          <div className="mt-2 flex gap-2">
            <SegmentedButton<Locale>
              value="mn"
              current={locale}
              onClick={setLocale}
            >
              Монгол
            </SegmentedButton>
            <SegmentedButton<Locale>
              value="en"
              current={locale}
              onClick={setLocale}
            >
              English
            </SegmentedButton>
          </div>
        </SectionCard>

        <SectionCard
          title={t.settingsPrivacyTitle}
          desc={t.settingsPrivacyDesc}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface2/60 px-3.5 py-3">
              <div>
                <p className="text-sm font-medium">
                  {t.settingsClearRecentTitle}
                </p>
                <p className="text-xs text-muted">
                  {t.settingsClearRecentDesc}
                </p>
              </div>
              <button
                onClick={handleClearRecent}
                className="shrink-0 rounded-full border border-border bg-surface1 px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {cleared ? t.settingsClearedToast : t.settingsClearRecentButton}
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t.settingsBlockedTitle}>
          {blocked.length === 0 ? (
            <p className="text-sm text-muted">{t.settingsBlockedEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {blocked.map((b) => (
                <li
                  key={b.blockedId}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-surface2/60 px-3.5 py-2.5"
                >
                  <Avatar id={b.blockedId} size={32} />
                  <span className="flex-1 truncate text-sm">
                    {getAvatar(b.blockedId).name}
                  </span>
                  <button
                    onClick={() => handleUnblock(b.blockedId)}
                    className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
                  >
                    {t.settingsUnblock}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </main>
    </AppShell>
  );
}
