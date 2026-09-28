"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface DirectMessage {
  id: string;
  from: "me" | "stranger";
  text: string;
  sentAt: number;
}

// Unlike random-match chat, DM history between friends is persisted in the
// direct_messages table — this is the deliberate "real messenger" thread.
export function useDirectThread(myUserId: string | null, friendId: string | null) {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!myUserId || !friendId) return;
    let cancelled = false;
    setLoading(true);
    setMessages([]);

    async function load() {
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${myUserId},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${myUserId})`,
        )
        .order("sent_at", { ascending: true });

      if (!cancelled && data) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            from: m.sender_id === myUserId ? "me" : "stranger",
            text: m.content,
            sentAt: new Date(m.sent_at).getTime(),
          })),
        );
      }
      if (!cancelled) setLoading(false);
    }
    load();

    const channel: RealtimeChannel = supabase
      .channel(`dm:${myUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `recipient_id=eq.${myUserId}`,
        },
        (payload) => {
          const m = payload.new as any;
          if (m.sender_id !== friendId) return;
          setMessages((prev) =>
            prev.some((existing) => existing.id === m.id)
              ? prev
              : [
                  ...prev,
                  {
                    id: m.id,
                    from: "stranger",
                    text: m.content,
                    sentAt: new Date(m.sent_at).getTime(),
                  },
                ],
          );
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [myUserId, friendId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!myUserId || !friendId || !trimmed) return;

      const optimistic: DirectMessage = {
        id: crypto.randomUUID(),
        from: "me",
        text: trimmed,
        sentAt: Date.now(),
      };
      setMessages((prev) => [...prev, optimistic]);

      const { data, error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: myUserId,
          recipient_id: friendId,
          content: trimmed,
        })
        .select()
        .single();

      if (error) {
        console.error("[drift] failed to send DM:", error.message);
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        return;
      }

      if (data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimistic.id
              ? { ...m, id: data.id, sentAt: new Date(data.sent_at).getTime() }
              : m,
          ),
        );
      }
    },
    [myUserId, friendId],
  );

  return { messages, loading, sendMessage };
}
