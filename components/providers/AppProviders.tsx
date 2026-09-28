"use client";

import { ProfileSetup } from "@/components/onboarding/ProfileSetup";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useProfile } from "@/hooks/useProfile";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { userId, ready } = useAnonymousAuth();
  const { needsOnboarding, saveProfile } = useProfile(userId);

  return (
    <>
      {children}
      {ready && needsOnboarding && (
        <ProfileSetup
          onDone={(nickname, avatarIndex) => saveProfile({ nickname, avatarIndex })}
        />
      )}
    </>
  );
}
