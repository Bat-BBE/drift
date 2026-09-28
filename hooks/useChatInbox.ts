"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useFriends } from "@/hooks/useFriends";
import { usePublicProfiles, type PublicProfile } from "@/hooks/usePublicProfiles";

export interface InboxEntry {
  friendId: string;
  since: string;
  profile: PublicProfile | null;
  lastMessage: { text: string; sentAt: number; mine: boolean } | null;
}

export function useChatInbox(userId: string | null) {
  const { friends, loading: friendsLoading } = useFriends(userId);
  const [lastByFriend, setLastByFriend] = useState<
    Record<string, { text: string; sentAt: number; mine: boolean }>
  >({});
  const friendIds = friends.map((f) => f.otherId);
  const profiles = usePublicProfiles(friendIds);

  useEffect(() => {
    if (!userId || friends.length === 0) return;
    let cancelled = false;

    supabase
      .from("direct_messages")
      .select("sender_id, recipient_id, content, sent_at")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("sent_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const map: Record<string, { text: string; sentAt: number; mine: boolean }> = {};
        for (const row of data as any[]) {
          const mine = row.sender_id === userId;
          const otherId = mine ? row.recipient_id : row.sender_id;
          if (map[otherId]) continue; // already have the most recent for this friend
          map[otherId] = {
            text: row.content,
            sentAt: new Date(row.sent_at).getTime(),
            mine,
          };
        }
        setLastByFriend(map);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, friends.length]);

  const entries: InboxEntry[] = friends
    .map((f) => ({
      friendId: f.otherId,
      since: f.since,
      profile: profiles[f.otherId] ?? null,
      lastMessage: lastByFriend[f.otherId] ?? null,
    }))
    .sort((a, b) => {
      const at = a.lastMessage?.sentAt ?? new Date(a.since).getTime();
      const bt = b.lastMessage?.sentAt ?? new Date(b.since).getTime();
      return bt - at;
    });

  return { entries, loading: friendsLoading };
}
