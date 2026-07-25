"use client";

import { useState } from "react";
import { findZodiac, getCompatibility } from "@/lib/zodiac";

export function ZodiacMatchCard({
  mySign,
  partnerSign,
  onClose,
}: {
  mySign: string;
  partnerSign: string;
  onClose?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const me = findZodiac(mySign);
  const partner = findZodiac(partnerSign);
  const combo = getCompatibility(mySign, partnerSign);

  if (!me || !partner) return null;

  const rows = [
    { icon: "❤️", label: "Хайр", me: me.love, partner: partner.love },
    {
      icon: "💬",
      label: "Ярилцах хэв маяг",
      me: me.chatStyle,
      partner: partner.chatStyle,
    },
    { icon: "🎮", label: "Hobby", me: me.hobby, partner: partner.hobby },
    {
      icon: "🎵",
      label: "Дуртай хөгжим",
      me: me.music,
      partner: partner.music,
    },
    {
      icon: "😂",
      label: "Хошин мэдрэмж",
      me: me.humor,
      partner: partner.humor,
    },
    {
      icon: me.nightOwl ? "🌙" : "☀️",
      label: "Идэвхтэй цаг",
      me: me.nightOwl
        ? "Шөнийн хүн"
        : me.morningPerson
          ? "Өглөөний хүн"
          : "Дунд зэрэг",
      partner: partner.nightOwl
        ? "Шөнийн хүн"
        : partner.morningPerson
          ? "Өглөөний хүн"
          : "Дунд зэрэг",
    },
    { icon: "👻", label: "Red flag", me: me.redFlag, partner: partner.redFlag },
    {
      icon: "✅",
      label: "Green flag",
      me: me.greenFlag,
      partner: partner.greenFlag,
    },
  ];

  const scoreRows = [
    {
      icon: "📈",
      label: "Dating score",
      me: me.datingScore,
      partner: partner.datingScore,
    },
    {
      icon: "🤝",
      label: "Friendship score",
      me: me.friendshipScore,
      partner: partner.friendshipScore,
    },
    {
      icon: "❤️",
      label: "Relationship score",
      me: me.relationshipScore,
      partner: partner.relationshipScore,
    },
  ];

  return (
    <div className="relative shrink-0 border-b border-border bg-surface2/60 px-3 py-3 sm:px-4">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Хаах"
          className="absolute right-2 top-2 rounded-full p-1.5 text-muted transition-colors hover:bg-surface1 hover:text-foreground active:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      )}

      {combo && (
        <div className="pr-6 text-center sm:pr-0">
          <p className="break-words text-sm font-semibold">
            {me.emoji} {partner.emoji} {combo.title}
          </p>
          <p className="mx-auto mt-0.5 max-w-[90%] break-words text-xs text-muted sm:max-w-none">
            {combo.message}
          </p>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < combo.score ? "text-brand-cyan" : "text-border"}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mx-auto mt-2 block px-2 py-1 text-xs text-muted underline underline-offset-2 hover:text-foreground active:opacity-70"
      >
        {expanded ? "Хураах" : "Дэлгэрэнгүй харах"}
      </button>

      {expanded && (
        <div className="mt-3 max-h-[45vh] space-y-2 overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[50vh]">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-surface2/95 px-1 py-1 text-[11px] font-medium text-muted backdrop-blur-sm">
            <span className="min-w-0 truncate">
              Чи ({me.emoji} {me.name})
            </span>
            <span className="min-w-0 truncate text-right">
              Тэр хүн ({partner.emoji} {partner.name})
            </span>
          </div>

          {rows.map((r) => (
            <div
              key={r.label}
              className="rounded-sm border border-border/60 bg-surface1/60 p-2"
            >
              <p className="text-[11px] text-muted">
                {r.icon} {r.label}
              </p>
              <div className="mt-1 flex flex-col gap-1 text-xs sm:flex-row sm:gap-2">
                <span className="min-w-0 flex-1 break-words">{r.me}</span>
                <span className="hidden shrink-0 text-muted sm:block">·</span>
                <span className="min-w-0 flex-1 break-words sm:text-right">
                  {r.partner}
                </span>
              </div>
            </div>
          ))}

          <div className="rounded-sm border border-border/60 bg-surface1/60 p-2">
            {scoreRows.map((s) => (
              <div
                key={s.label}
                className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs"
              >
                <span className="min-w-0 break-words text-muted">
                  {s.icon} {s.label}
                </span>
                <span className="shrink-0 whitespace-nowrap">
                  {s.me}/5 · {s.partner}/5
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
