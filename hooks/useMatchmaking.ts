"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface MatchedSession {
  id: string;
  partnerId: string;
  sharedTags: string[];
}

/**
 * Joins the match_queue and listens for a match_sessions row to appear
 * where the current user is either participant. Pairing itself happens
 * server-side in the `attempt_match()` Postgres trigger (see
 * supabase/migrations/0001_init.sql) — this hook only queues and listens.
 */
export function useMatchmaking(userId: string | null) {
  const [status, setStatus] = useState<"idle" | "searching" | "matched">("idle");
  const [session, setSession] = useState<MatchedSession | null>(null);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const cleanupChannels = useCallback(() => {
    channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
    channelsRef.current = [];
  }, []);

  const startSearch = useCallback(
    async (interestTags: string[]) => {
      if (!userId) return;
      setStatus("searching");
      setSession(null);

      // A user can only have one queue entry — upsert replaces any stale one.
      const { error } = await supabase
        .from("match_queue")
        .upsert({ user_id: userId, interest_tags: interestTags }, { onConflict: "user_id" });

      if (error) {
        console.error("[drift] failed to join queue:", error.message);
        setStatus("idle");
        return;
      }

      // Two separate subscriptions because Realtime's postgres_changes
      // filter only supports a single equality check, not an OR.
      const asA = supabase
        .channel(`match-as-a-${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "match_sessions", filter: `user_a_id=eq.${userId}` },
          (payload) => handleMatch(payload.new as any, userId)
        )
        .subscribe();

      const asB = supabase
        .channel(`match-as-b-${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "match_sessions", filter: `user_b_id=eq.${userId}` },
          (payload) => handleMatch(payload.new as any, userId)
        )
        .subscribe();

      channelsRef.current = [asA, asB];

      // Also cover the case where a match was already created between the
      // upsert call and the subscriptions going live (race on slow networks).
      const { data: existing } = await supabase
        .from("match_sessions")
        .select("*")
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
        .is("ended_at", null)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) handleMatch(existing as any, userId);
    },
    [userId]
  );

  function handleMatch(row: any, uid: string) {
    const partnerId = row.user_a_id === uid ? row.user_b_id : row.user_a_id;
    setSession({ id: row.id, partnerId, sharedTags: row.shared_interest_tags ?? [] });
    setStatus("matched");
    cleanupChannels();
  }

  const cancelSearch = useCallback(async () => {
    if (!userId) return;
    cleanupChannels();
    await supabase.from("match_queue").delete().eq("user_id", userId);
    setStatus("idle");
  }, [userId, cleanupChannels]);

  useEffect(() => () => cleanupChannels(), [cleanupChannels]);

  return { status, session, startSearch, cancelSearch, resetSession: () => setSession(null) };
}
