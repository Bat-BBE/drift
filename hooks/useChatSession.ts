"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message } from "@/components/chat/ChatBubble";

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

function aggregateReactions(
  rows: { message_id: string; user_id: string; emoji: string }[],
): Record<string, MessageReaction[]> {
  const byMessage: Record<string, Record<string, string[]>> = {};
  for (const row of rows) {
    byMessage[row.message_id] ??= {};
    byMessage[row.message_id][row.emoji] ??= [];
    byMessage[row.message_id][row.emoji].push(row.user_id);
  }
  const result: Record<string, MessageReaction[]> = {};
  for (const [messageId, byEmoji] of Object.entries(byMessage)) {
    result[messageId] = Object.entries(byEmoji).map(([emoji, userIds]) => ({
      emoji,
      userIds,
    }));
  }
  return result;
}

export function useChatSession(
  sessionId: string | null,
  userId: string | null,
  partnerId: string | null,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>(
    {},
  );
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [partnerLastReadAt, setPartnerLastReadAt] = useState(0);
  const [messageError, setMessageError] = useState<string | null>(null);
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
            flagged: m.flagged,
            flagReason: m.flag_reason as "keyword" | "link" | null,
            replyToId: m.reply_to_id as string | null,
          })),
        );
      }

      const { data: reactionRows } = await supabase
        .from("message_reactions")
        .select("message_id, user_id, emoji")
        .eq("session_id", sid);

      if (!cancelled && reactionRows) {
        setReactions(aggregateReactions(reactionRows));
      }
    }
    init();

    const channel = supabase
      .channel(`session:${sid}`, {
        config: { private: true, presence: { key: uid } },
      })
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
                flagged: m.flagged,
                flagReason: m.flag_reason as "keyword" | "link" | null,
                replyToId: m.reply_to_id as string | null,
              },
            ];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sid}`,
        },
        (payload) => {
          const old = payload.old as any;
          setMessages((prev) => prev.filter((m) => m.id !== old.id));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `session_id=eq.${sid}`,
        },
        async () => {
          const { data: reactionRows } = await supabase
            .from("message_reactions")
            .select("message_id, user_id, emoji")
            .eq("session_id", sid);
          if (!cancelled && reactionRows) {
            setReactions(aggregateReactions(reactionRows));
          }
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
        if (payload.payload.userId === uid) return; // ignore our own broadcast
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
      .subscribe(async (subStatus, err) => {
        if (subStatus === "SUBSCRIBED") {
          await channel.track({ userId: uid });
        } else if (subStatus === "CHANNEL_ERROR") {
          console.error("[drift] session channel auth failed:", err);
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
    async (content: string, replyToId?: string | null) => {
      if (!sessionId || !userId || !content.trim()) return;
      const { error } = await supabase.from("messages").insert({
        session_id: sessionId,
        sender_id: userId,
        content: content.trim(),
        reply_to_id: replyToId ?? null,
      });
      if (error) {
        if (error.message.includes("rate_limited")) {
          setMessageError("rate_limited");
          setTimeout(() => setMessageError(null), 2500);
        } else if (error.message.includes("message_blocked")) {
          setMessageError("blocked");
          setTimeout(() => setMessageError(null), 2500);
        } else {
          console.error("[drift] failed to send message:", error.message);
        }
      }
    },
    [sessionId, userId],
  );

  const deleteMessage = useCallback(async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    await supabase.from("messages").delete().eq("id", messageId);
  }, []);

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!sessionId || !userId) return;
      const mine = reactions[messageId]?.find((r) =>
        r.userIds.includes(userId),
      );

      if (mine && mine.emoji === emoji) {
        await supabase
          .from("message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", userId);
      } else {
        await supabase.from("message_reactions").upsert(
          {
            message_id: messageId,
            session_id: sessionId,
            user_id: userId,
            emoji,
          },
          { onConflict: "message_id,user_id" },
        );
      }
    },
    [sessionId, userId, reactions],
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
    async (reason: string, reportedId: string): Promise<boolean> => {
      if (!sessionId || !userId) return false;
      const { error: reportError } = await supabase.from("reports").insert({
        session_id: sessionId,
        reporter_id: userId,
        reported_id: reportedId,
        reason,
      });
      if (reportError) {
        if (reportError.message.includes("rate_limited")) {
          setMessageError("rate_limited");
          setTimeout(() => setMessageError(null), 2500);
        } else {
          console.error("[drift] failed to file report:", reportError.message);
        }
        return false;
      }
      await supabase
        .from("match_sessions")
        .update({ ended_at: new Date().toISOString(), end_reason: "reported" })
        .eq("id", sessionId);
      return true;
    },
    [sessionId, userId],
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
    reactions,
    partnerTyping,
    partnerDisconnected,
    partnerLastReadAt,
    messageError,
    sendMessage,
    deleteMessage,
    toggleReaction,
    notifyTyping,
    leaveSession,
    reportSession,
    rateSession,
    deleteSession,
  };
}
