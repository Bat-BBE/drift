"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface PublicProfile {
  nickname: string;
  avatarIndex: number;
}

export function usePublicProfiles(ids: string[]) {
  const [profiles, setProfiles] = useState<Record<string, PublicProfile>>({});
  const key = ids.slice().sort().join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    supabase
      .from("public_profiles")
      .select("id, nickname, avatar_id")
      .in("id", key.split(","))
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setProfiles((prev) => {
          const next = { ...prev };
          for (const row of data as any[]) {
            next[row.id] = {
              nickname: row.nickname,
              avatarIndex: row.avatar_id,
            };
          }
          return next;
        });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return profiles;
}
