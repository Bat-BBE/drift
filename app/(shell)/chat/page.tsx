"use client";

import Link from "next/link";
import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useChatInbox } from "@/hooks/useChatInbox";
import { useLocale } from "@/lib/i18n";

function formatTime(ts: number, locale: string) {
  const date = new Date(ts);
  const isToday = new Date().toDateString() === date.toDateString();
  if (isToday) {
    return date.toLocaleTimeString(locale === "mn" ? "mn-MN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ChatInboxPage() {
  const { userId, ready } = useAnonymousAuth();
  const { entries, loading } = useChatInbox(userId);
  const { t, locale } = useLocale();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-14 lg:px-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">
          {t.chatInboxTitle}
        </h1>
        <Link
          href="/match"
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-pink px-4 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(124,92,255,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          ⚡ {t.startRandomChatCta}
        </Link>
      </div>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface1/60">
        {!ready || loading ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {t.loading}
          </p>
        ) : entries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {t.chatInboxEmpty}
          </p>
        ) : (
          entries.map((entry) => {
            const fallback = getAvatar(entry.friendId);
            const name = entry.profile?.nickname ?? fallback.name;
            const preview = entry.lastMessage
              ? `${entry.lastMessage.mine ? `${t.youPrefix} ` : ""}${entry.lastMessage.text}`
              : t.sayHiPreview;

            return (
              <Link
                key={entry.friendId}
                href={`/chat/${entry.friendId}`}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface2/50 ${
                  entry.unread ? "bg-brand/[0.04]" : ""
                }`}
              >
                <span className="relative shrink-0">
                  <Avatar
                    id={entry.friendId}
                    avatarIndex={entry.profile?.avatarIndex}
                    size={44}
                  />
                  {entry.unread && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface1 bg-brand" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${entry.unread ? "font-bold text-foreground" : "font-medium"}`}
                  >
                    {name}
                  </p>
                  <p
                    className={`truncate text-xs ${entry.unread ? "font-semibold text-foreground" : "text-muted"}`}
                  >
                    {preview}
                  </p>
                </div>
                {entry.lastMessage && (
                  <span
                    className={`shrink-0 font-mono text-[11px] ${entry.unread ? "font-bold text-brand" : "text-muted"}`}
                  >
                    {formatTime(entry.lastMessage.sentAt, locale)}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
