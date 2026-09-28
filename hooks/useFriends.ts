"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Friend {
  otherId: string;
  since: string;
}

export function useFriends(userId: string | null) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("friend_links")
      .select("user_a_id, user_b_id, created_at")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const seen = new Set<string>();
      const list: Friend[] = [];
      for (const row of data as any[]) {
        const otherId = row.user_a_id === userId ? row.user_b_id : row.user_a_id;
        if (seen.has(otherId)) continue;
        seen.add(otherId);
        list.push({ otherId, since: row.created_at });
      }
      setFriends(list);
    } else if (error) {
      console.error("[drift] failed to load friends:", error.message);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFriend = useCallback(
    async (partnerId: string) => {
      if (!userId) return;
      const { error } = await supabase.from("friend_links").insert({
        user_a_id: userId,
        user_b_id: partnerId,
      });
      if (error && error.code !== "23505") {
        console.error("[drift] failed to add friend:", error.message);
        return;
      }
      refresh();
    },
    [userId, refresh],
  );

  return { friends, loading, addFriend, refresh };
}
