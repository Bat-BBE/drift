"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message } from "@/components/chat/ChatBubble";

export function useChatSession(
  sessionId: string | null,
  userId: string | null,
  partnerId: string | null,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [partnerLastReadAt, setPartnerLastReadAt] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId || !userId) return;
    const sid = sessionId;
    const uid = userId;
    let cancelled = false;

    async function init() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sid)
        .order("sent_at", { ascending: true });

      if (!cancelled && data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            from: m.sender_id === uid ? "me" : "stranger",
            text: m.content,
            sentAt: new Date(m.sent_at).getTime(),
          })),
        );
      }
    }
    init();

    const channel = supabase
      .channel(`session:${sid}`, { config: { presence: { key: uid } } })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sid}`,
        },
        (payload) => {
          const m = payload.new as any;
          setMessages((prev) => {
            if (prev.some((existing) => existing.id === m.id)) return prev;
            return [
              ...prev,
              {
                id: m.id,
                from: m.sender_id === uid ? "me" : "stranger",
                text: m.content,
                sentAt: new Date(m.sent_at).getTime(),
              },
            ];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "match_sessions",
          filter: `id=eq.${sid}`,
        },
        (payload) => {
          const s = payload.new as any;
          if (s.ended_at && s.end_reason !== "left") {
            setPartnerDisconnected(true);
          }
        },
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId === uid) return;
        setPartnerTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setPartnerTyping(false), 2000);
      })
      .on("broadcast", { event: "read" }, (payload) => {
        if (payload.payload.userId === uid) return;
        setPartnerLastReadAt(payload.payload.at);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        if (
          partnerId &&
          leftPresences.some((p: any) => p.userId === partnerId)
        ) {
          setPartnerDisconnected(true);
        }
      })
      .subscribe(async (subStatus) => {
        if (subStatus === "SUBSCRIBED") {
          await channel.track({ userId: uid });
        }
      });

    channelRef.current = channel;

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, userId, partnerId]);

  useEffect(() => {
    if (!channelRef.current || messages.length === 0 || !userId) return;
    channelRef.current.send({
      type: "broadcast",
      event: "read",
      payload: { userId, at: Date.now() },
    });
  }, [messages.length, userId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || !userId || !content.trim()) return;
      const { error } = await supabase
        .from("messages")
        .insert({
          session_id: sessionId,
          sender_id: userId,
          content: content.trim(),
        });
      if (error)
        console.error("[drift] failed to send message:", error.message);
    },
    [sessionId, userId],
  );

  const notifyTyping = useCallback(() => {
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId },
    });
  }, [userId]);

  const leaveSession = useCallback(async () => {
    if (!sessionId) return;
    await supabase
      .from("match_sessions")
      .update({ ended_at: new Date().toISOString(), end_reason: "left" })
      .eq("id", sessionId);
  }, [sessionId]);

  const reportSession = useCallback(
    async (reason: string, reportedId: string) => {
      if (!sessionId || !userId) return;
      await supabase.from("reports").insert({
        session_id: sessionId,
        reporter_id: userId,
        reported_id: reportedId,
        reason,
        message_snapshot: messages,
      });
      await supabase
        .from("match_sessions")
        .update({ ended_at: new Date().toISOString(), end_reason: "reported" })
        .eq("id", sessionId);
    },
    [sessionId, userId, messages],
  );

  const rateSession = useCallback(
    async (value: "up" | "down", ratedId: string) => {
      if (!sessionId || !userId) return;
      await supabase.from("ratings").insert({
        session_id: sessionId,
        rater_id: userId,
        rated_id: ratedId,
        value,
      });
    },
    [sessionId, userId],
  );

  const deleteSession = useCallback(async () => {
    if (!sessionId) return;
    await supabase.from("match_sessions").delete().eq("id", sessionId);
  }, [sessionId]);

  return {
    messages,
    partnerTyping,
    partnerDisconnected,
    partnerLastReadAt,
    sendMessage,
    notifyTyping,
    leaveSession,
    reportSession,
    rateSession,
    deleteSession,
  };
}
