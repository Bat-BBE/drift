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
  unread: boolean;
}

export function useChatInbox(userId: string | null) {
  const { friends, loading: friendsLoading } = useFriends(userId);
  const [lastByFriend, setLastByFriend] = useState<
    Record<string, { text: string; sentAt: number; mine: boolean }>
  >({});
  const [readByFriend, setReadByFriend] = useState<Record<string, number>>({});
  const friendIds = friends.map((f) => f.otherId);
  const profiles = usePublicProfiles(friendIds);

  useEffect(() => {
    if (!userId || friends.length === 0) return;
    let cancelled = false;

    Promise.all([
      supabase
        .from("direct_messages")
        .select("sender_id, recipient_id, content, sent_at")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("sent_at", { ascending: false })
        .limit(500),
      supabase
        .from("direct_message_reads")
        .select("friend_id, last_read_at")
        .eq("user_id", userId),
    ]).then(([{ data: messages, error }, { data: reads, error: readsError }]) => {
      if (cancelled || error || !messages) return;
      // Same defensive check as useUnreadThreadsCount: if the read-state
      // query itself failed, don't let every conversation fall back to
      // "never read" — leave the previously-known read state in place.
      if (readsError) {
        console.error(
          "[drift] failed to load DM read state:",
          readsError.message,
        );
      }
      const map: Record<string, { text: string; sentAt: number; mine: boolean }> = {};
      for (const row of messages as any[]) {
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

      if (!readsError) {
        const readMap: Record<string, number> = {};
        for (const row of (reads ?? []) as any[]) {
          readMap[row.friend_id] = new Date(row.last_read_at).getTime();
        }
        setReadByFriend(readMap);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId, friends.length]);

  const entries: InboxEntry[] = friends
    .map((f) => {
      const lastMessage = lastByFriend[f.otherId] ?? null;
      const unread =
        !!lastMessage &&
        !lastMessage.mine &&
        lastMessage.sentAt > (readByFriend[f.otherId] ?? 0);
      return {
        friendId: f.otherId,
        since: f.since,
        profile: profiles[f.otherId] ?? null,
        lastMessage,
        unread,
      };
    })
    .sort((a, b) => {
      const at = a.lastMessage?.sentAt ?? new Date(a.since).getTime();
      const bt = b.lastMessage?.sentAt ?? new Date(b.since).getTime();
      return bt - at;
    });

  return { entries, loading: friendsLoading };
}
