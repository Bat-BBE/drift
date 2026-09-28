"use client";

import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { AVATARS } from "@/lib/avatars";
import { useLocale } from "@/lib/i18n";

export function ProfileSetup({
  onDone,
}: {
  onDone: (nickname: string, avatarIndex: number) => void;
}) {
  const { t } = useLocale();
  const defaultAvatarIndex = Math.floor(Math.random() * AVATARS.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-bubble-in rounded-[24px] border border-border bg-surface1 p-6 text-center shadow-[0_20px_60px_rgba(124,92,255,0.2)]">
        <h2 className="font-display text-lg font-bold">
          {t.profileSetupTitle}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {t.profileSetupSubtitle}
        </p>

        <div className="mt-5">
          <ProfileEditor
            initialNickname={AVATARS[defaultAvatarIndex].name}
            initialAvatarIndex={defaultAvatarIndex}
            onSave={onDone}
            saveLabel={t.profileContinueButton}
          />
        </div>
      </div>
    </div>
  );
}
