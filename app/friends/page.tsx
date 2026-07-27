"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { getFriends, type Friend } from "@/lib/friends";
import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { TopControls } from "@/components/shared/TopControls";

export default function FriendsPage() {
  const router = useRouter();
  const { userId, ready } = useAnonymousAuth();

  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !userId) return;

    let cancelled = false;

    getFriends(userId).then((list) => {
      if (!cancelled) {
        setFriends(list);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ready, userId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-surface1 px-4 pt-8 pb-28">
      <TopControls
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7">
          <h1 className="font-display text-3xl font-bold">{t.friendsTitle}</h1>

          <p className="mt-2 text-sm text-muted">
            {friends.length}{" "}
            {locale === "mn"
              ? friends.length === 1
                ? "найз"
                : "найзууд"
              : friends.length === 1
                ? "Friend"
                : "Friends"}
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface1 p-4 shadow-sm"
              >
                <div className="h-14 w-14 animate-pulse rounded-full bg-surface2" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface2" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && friends.length === 0 && (
          <div className="mt-16 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-6xl">
              🫂
            </div>

            <h2 className="mt-8 text-xl font-bold">
              {locale === "mn" ? "Одоогоор найз байхгүй" : "No Friends Yet"}
            </h2>

            <p className="mt-3 max-w-xs text-center text-sm leading-6 text-muted">
              {locale === "mn"
                ? "Та шинэ хүмүүстэй чатлаж, харилцан Friend дарснаар найзуул болно."
                : "Start chatting with new people. When both of you become friends they'll appear here."}
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105 active:scale-95"
            >
              {locale === "mn" ? "Хүнтэй холбогдох" : "Start Matching"}
            </button>
          </div>
        )}

        {!loading && friends.length > 0 && (
          <ul className="space-y-4">
            {friends.map((friend) => {
              const avatar = getAvatar(friend.partnerId);

              return (
                <li
                  key={friend.partnerId}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface1 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="rounded-full ring-2 ring-primary/20">
                    <Avatar id={friend.partnerId} size={56} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{avatar.name}</h3>

                    <p className="mt-1 text-xs text-muted">
                      💜 {t.friendSince}
                    </p>

                    <p className="text-xs text-muted">
                      {new Date(friend.since).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-full bg-green-500/15 px-3 py-1 text-[11px] font-medium text-green-500">
                    Friend
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition hover:scale-105 active:scale-95"
      >
        {t.backHome}
      </button>
    </main>
  );
}
