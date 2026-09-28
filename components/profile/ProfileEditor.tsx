"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/shared/Avatar";
import { AVATARS } from "@/lib/avatars";
import { useLocale } from "@/lib/i18n";

export function ProfileEditor({
  initialNickname,
  initialAvatarIndex,
  onSave,
  saveLabel,
}: {
  initialNickname: string;
  initialAvatarIndex: number;
  onSave: (nickname: string, avatarIndex: number) => void;
  saveLabel: string;
}) {
  const { t } = useLocale();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatarIndex, setAvatarIndex] = useState(initialAvatarIndex);

  function randomize() {
    const idx = Math.floor(Math.random() * AVATARS.length);
    setAvatarIndex(idx);
    setNickname(AVATARS[idx].name);
  }

  const trimmed = nickname.trim();

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <Avatar id="preview" avatarIndex={avatarIndex} size={72} />
        <button
          onClick={randomize}
          className="rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          {t.nicknameRandomButton}
        </button>
      </div>

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value.slice(0, 24))}
        placeholder={t.nicknamePlaceholder}
        maxLength={24}
        autoComplete="off"
        className="mt-4 h-12 w-full rounded-xl border border-border bg-surface2 px-4 text-center text-base outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />

      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {t.chooseAvatarLabel}
      </p>
      <div className="mt-2.5 grid grid-cols-6 gap-2 xs:grid-cols-7">
        {AVATARS.map((a, i) => (
          <button
            key={a.name}
            onClick={() => setAvatarIndex(i)}
            aria-label={a.name}
            aria-pressed={avatarIndex === i}
            className={`flex items-center justify-center rounded-full p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95 ${
              avatarIndex === i
                ? "ring-2 ring-brand ring-offset-2 ring-offset-surface1"
                : ""
            }`}
          >
            <Avatar id={a.name} avatarIndex={i} size={38} />
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="mt-6 py-3 w-full bg-gradient-to-r from-brand to-brand-pink"
        disabled={!trimmed}
        onClick={() => onSave(trimmed, avatarIndex)}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
