"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// Counts how many friend threads have a message from them newer than the
// last time you (persistently) marked that thread read — the badge shown
// on the Chat nav tab. Takes the current friend id list from the caller
// (rather than fetching its own) so callers that already have it, like
// AppShell, don't pay for a duplicate friend_links query.
export function useUnreadThreadsCount(
  userId: string | null,
  friendIds: string[],
) {
  const [count, setCount] = useState(0);
  const friendIdKey = friendIds.slice().sort().join(",");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    // A message sent before you unfriended someone (or from any id that
    // isn't currently your friend) must not count — the Chat inbox only
    // shows current friends, so an unread from anyone else can never be
    // opened/cleared and would otherwise stick forever.
    const currentFriendIds = new Set(friendIdKey ? friendIdKey.split(",") : []);

    async function refresh() {
      const [
        { data: incoming, error: incomingError },
        { data: reads, error: readsError },
      ] = await Promise.all([
        supabase
          .from("direct_messages")
          .select("sender_id, sent_at")
          .eq("recipient_id", userId!)
          .order("sent_at", { ascending: false })
          .limit(500),
        supabase
          .from("direct_message_reads")
          .select("friend_id, last_read_at")
          .eq("user_id", userId!),
      ]);
      if (cancelled) return;

      // If either query failed (e.g. a migration hasn't been applied
      // yet), bail out instead of treating "couldn't load read state" as
      // "nothing has ever been read" — that would make every past
      // conversation look permanently unread.
      if (incomingError || readsError) {
        console.error(
          "[drift] failed to compute unread count:",
          incomingError?.message ?? readsError?.message,
        );
        return;
      }

      const latestBySender = new Map<string, number>();
      for (const row of (incoming ?? []) as any[]) {
        if (!latestBySender.has(row.sender_id)) {
          latestBySender.set(row.sender_id, new Date(row.sent_at).getTime());
        }
      }
      const readBySender = new Map<string, number>();
      for (const row of (reads ?? []) as any[]) {
        readBySender.set(row.friend_id, new Date(row.last_read_at).getTime());
      }

      let unread = 0;
      for (const [senderId, latest] of latestBySender) {
        if (!currentFriendIds.has(senderId)) continue;
        if (latest > (readBySender.get(senderId) ?? 0)) unread += 1;
      }
      setCount(unread);
    }
    refresh();

    const channel = supabase
      .channel(`unread:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `recipient_id=eq.${userId}`,
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // friendIdKey is a stable, comparable stand-in for the friends array
    // (which is a new array reference every render) — needed so this
    // effect re-runs once the async friends fetch actually resolves,
    // not just when userId changes.
  }, [userId, friendIdKey]);

  return count;
}
