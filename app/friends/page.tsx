"use client";

import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useFriends } from "@/hooks/useFriends";
import { usePublicProfiles } from "@/hooks/usePublicProfiles";
import { useLocale } from "@/lib/i18n";

export default function FriendsPage() {
  const { userId, ready } = useAnonymousAuth();
  const { friends, loading } = useFriends(userId);
  const profiles = usePublicProfiles(friends.map((f) => f.otherId));
  const { t, locale } = useLocale();

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl px-6 py-10 lg:px-10">
        <h1 className="font-display text-2xl font-bold">{t.friendsTitle}</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted">
          {t.friendsSubtitle}
        </p>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface1/60">
          {!ready || loading ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {t.loading}
            </p>
          ) : friends.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {t.friendsEmpty}
            </p>
          ) : (
            friends.map((f) => {
              const fallback = getAvatar(f.otherId);
              const profile = profiles[f.otherId];
              const name = profile?.nickname ?? fallback.name;
              return (
                <Link
                  key={f.otherId}
                  href={`/chat/${f.otherId}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface2/50"
                >
                  <Avatar
                    id={f.otherId}
                    avatarIndex={profile?.avatarIndex}
                    size={42}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted">
                      {t.friendSince}{" "}
                      {new Date(f.since).toLocaleDateString(
                        locale === "mn" ? "mn-MN" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-lg text-muted" aria-hidden>
                    💬
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </AppShell>
  );
}
