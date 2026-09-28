"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopControls } from "@/components/shared/TopControls";
import { Avatar } from "@/components/shared/Avatar";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import {
  ChatIcon,
  FriendsIcon,
  HomeIcon,
  SettingsIcon,
} from "@/components/nav/NavIcons";

function useNavItems() {
  const { t } = useLocale();
  return [
    { href: "/", label: t.navHome, Icon: HomeIcon },
    { href: "/chat", label: t.navChat, Icon: ChatIcon },
    { href: "/friends", label: t.navFriends, Icon: FriendsIcon },
    { href: "/settings", label: t.navSettings, Icon: SettingsIcon },
  ] as const;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-pink text-base shadow-[0_6px_20px_rgba(124,92,255,0.35)]">
        💬
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-bold">
          Drift
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { userId } = useAnonymousAuth();
  const navItems = useNavItems();

  return (
    <div className="min-h-screen bg-background">
      <TopControls
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border bg-surface1/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <Logo />

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand/15 text-brand"
                    : "text-muted hover:bg-surface2 hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {userId && (
            <Link
              href="/settings"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface2/70 px-3 py-2.5 transition-colors hover:bg-surface2"
            >
              <Avatar id={userId} size={34} />
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium leading-tight">
                  {t.guestLabel}
                </span>
                <span className="block text-[11px] text-muted">
                  {t.availableStatus}
                </span>
              </span>
              <span className="text-muted">›</span>
            </Link>
          )}
        </div>
      </aside>

      <main className="pb-20 lg:pb-0 lg:pl-64">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-border bg-surface1/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? "text-brand" : "text-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
