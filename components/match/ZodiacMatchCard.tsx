"use client";

import { useState } from "react";
import { findZodiac, getCompatibility } from "@/lib/zodiac";

export function ZodiacMatchCard({
  mySign,
  partnerSign,
}: {
  mySign: string;
  partnerSign: string;
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
    <div className="border-b border-border bg-surface2/60 px-4 py-3">
      {combo && (
        <div className="text-center">
          <p className="text-sm font-semibold">
            {me.emoji} {partner.emoji} {combo.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">{combo.message}</p>
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
        className="mx-auto mt-2 block text-xs text-muted underline underline-offset-2 hover:text-foreground"
      >
        {expanded ? "Хураах" : "Дэлгэрэнгүй харах"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          <div className="flex justify-between px-1 text-[11px] font-medium text-muted">
            <span>
              Чи ({me.emoji} {me.name})
            </span>
            <span>
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
              <div className="mt-1 flex gap-2 text-xs">
                <span className="flex-1">{r.me}</span>
                <span className="flex-1 text-right">{r.partner}</span>
              </div>
            </div>
          ))}

          <div className="rounded-sm border border-border/60 bg-surface1/60 p-2">
            {scoreRows.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted">
                  {s.icon} {s.label}
                </span>
                <span>
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
