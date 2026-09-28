"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  readLocalProfile,
  writeLocalProfile,
  type LocalProfile,
} from "@/lib/profile";

// The nickname/avatar you choose lives primarily in this browser's
// localStorage (so it's yours, on this device) and is mirrored to
// public_profiles only so friends can look up your current nickname when
// you're not around to broadcast it live.
export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setProfile(readLocalProfile());
    setChecked(true);
  }, []);

  const saveProfile = useCallback(
    async (next: LocalProfile) => {
      writeLocalProfile(next);
      setProfile(next);
      if (!userId) return;
      const { error } = await supabase.from("public_profiles").upsert({
        id: userId,
        nickname: next.nickname,
        avatar_id: next.avatarIndex,
      });
      if (error) {
        console.error("[drift] failed to sync profile:", error.message);
      }
    },
    [userId],
  );

  return {
    profile,
    needsOnboarding: checked && !profile,
    saveProfile,
  };
}
