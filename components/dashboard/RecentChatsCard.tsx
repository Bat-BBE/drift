"use client";

import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { useRecentChats } from "@/hooks/useRecentChats";
import { useLocale } from "@/lib/i18n";

function formatTime(ts: number, locale: string) {
  return new Date(ts).toLocaleTimeString(locale === "mn" ? "mn-MN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentChatsCard() {
  const { t, locale } = useLocale();
  const { entries } = useRecentChats();

  return (
    <div className="rounded-2xl border border-border bg-surface1/70 p-4 backdrop-blur-xl">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <span aria-hidden>💬</span>
        {t.recentChatsTitle}
      </p>

      {entries.length === 0 ? (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          {t.recentChatsEmpty}
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {entries.map((entry) => (
            <li key={`${entry.partnerId}-${entry.endedAt}`} className="flex items-center gap-2.5">
              <Avatar id={entry.partnerId} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium leading-tight">
                  {getAvatar(entry.partnerId).name}
                </p>
                <p className="truncate text-xs text-muted">
                  {t.recentChatEndedLabel}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted">
                {formatTime(entry.endedAt, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
