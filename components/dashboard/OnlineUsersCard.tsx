"use client";

import { Avatar } from "@/components/shared/Avatar";
import { useLocale } from "@/lib/i18n";

export function OnlineUsersCard({
  count,
  sampleIds,
}: {
  count: number | null;
  sampleIds: string[];
}) {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl border border-border bg-surface1/70 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {t.onlineUsersTitle}
        </p>
        <span className="font-mono text-sm font-semibold text-muted">
          {count === null ? "…" : count.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 flex items-center -space-x-2">
        {sampleIds.map((id) => (
          <Avatar key={id} id={id} size={30} className="ring-2 ring-surface1" />
        ))}
        {sampleIds.length === 0 && count !== null && (
          <span className="text-xs text-muted">{t.onlineConnecting}</span>
        )}
        <span className="ml-4 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-dashed border-border text-sm text-muted">
          +
        </span>
      </div>
    </div>
  );
}
