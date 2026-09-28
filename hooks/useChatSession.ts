"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message } from "@/components/chat/ChatBubble";

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

// Chat content never touches the database — messages, edits and reactions
// are exchanged purely as Supabase Realtime broadcast events on the
// session's channel and kept only in each client's memory. Closing the
// room (leaving, matching again, closing the tab) throws all of it away
// for good; there is nothing server-side to purge.
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 3000;
const RATE_LIMIT_MAX = 6;
const LINK_PATTERN = /(https?:\/\/|www\.)\S+/i;

function aggregateReactions(
  byMessage: Record<string, Record<string, Set<string>>>,
): Record<string, MessageReaction[]> {
  const result: Record<string, MessageReaction[]> = {};
  for (const [messageId, byEmoji] of Object.entries(byMessage)) {
    const list = Object.entries(byEmoji)
      .filter(([, userIds]) => userIds.size > 0)
      .map(([emoji, userIds]) => ({ emoji, userIds: Array.from(userIds) }));
    if (list.length > 0) result[messageId] = list;
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
  const reactionState = useRef<Record<string, Record<string, Set<string>>>>(
    {},
  );
  const sentTimestamps = useRef<number[]>([]);

  // Fresh room, empty transcript — nothing is ever loaded from storage.
  useEffect(() => {
    setMessages([]);
    setReactions({});
    reactionState.current = {};
    setPartnerTyping(false);
    setPartnerDisconnected(false);
    setPartnerLastReadAt(0);
    sentTimestamps.current = [];
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !userId) return;
    const sid = sessionId;
    const uid = userId;

    const channel = supabase
      .channel(`session:${sid}`, {
        config: { private: true, presence: { key: uid } },
      })
      .on("broadcast", { event: "message" }, (payload) => {
        const m = payload.payload as Message & { senderId: string };
        if (m.senderId === uid) return;
        setMessages((prev) =>
          prev.some((existing) => existing.id === m.id)
            ? prev
            : [...prev, { ...m, from: "stranger" }],
        );
      })
      .on("broadcast", { event: "delete-message" }, (payload) => {
        const { messageId, senderId } = payload.payload as {
          messageId: string;
          senderId: string;
        };
        if (senderId === uid) return;
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      })
      .on("broadcast", { event: "reaction" }, (payload) => {
        const { messageId, userId: fromUser, emoji, action } =
          payload.payload as {
            messageId: string;
            userId: string;
            emoji: string;
            action: "add" | "remove";
          };
        if (fromUser === uid) return;
        reactionState.current[messageId] ??= {};
        reactionState.current[messageId][emoji] ??= new Set();
        if (action === "add") {
          reactionState.current[messageId][emoji].add(fromUser);
        } else {
          reactionState.current[messageId][emoji].delete(fromUser);
        }
        setReactions(aggregateReactions(reactionState.current));
      })
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
      const trimmed = content.trim();
      if (!sessionId || !userId || !channelRef.current || !trimmed) return;

      if (trimmed.length > MAX_MESSAGE_LENGTH) return;

      const now = Date.now();
      sentTimestamps.current = sentTimestamps.current.filter(
        (t) => now - t < RATE_LIMIT_WINDOW_MS,
      );
      if (sentTimestamps.current.length >= RATE_LIMIT_MAX) {
        setMessageError("rate_limited");
        setTimeout(() => setMessageError(null), 2500);
        return;
      }
      sentTimestamps.current.push(now);

      const flagged = LINK_PATTERN.test(trimmed);
      const message: Message = {
        id: crypto.randomUUID(),
        from: "me",
        text: trimmed,
        sentAt: now,
        flagged,
        flagReason: flagged ? "link" : null,
        replyToId: replyToId ?? null,
      };

      setMessages((prev) => [...prev, message]);
      await channelRef.current.send({
        type: "broadcast",
        event: "message",
        payload: { ...message, senderId: userId },
      });
    },
    [sessionId, userId],
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      await channelRef.current?.send({
        type: "broadcast",
        event: "delete-message",
        payload: { messageId, senderId: userId },
      });
    },
    [userId],
  );

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!userId || !channelRef.current) return;
      const mine = reactions[messageId]?.find((r) =>
        r.userIds.includes(userId),
      );
      const action: "add" | "remove" =
        mine && mine.emoji === emoji ? "remove" : "add";

      // If I already had a different reaction on this message, clear it first.
      if (mine && mine.emoji !== emoji) {
        reactionState.current[messageId] ??= {};
        reactionState.current[messageId][mine.emoji] ??= new Set();
        reactionState.current[messageId][mine.emoji].delete(userId);
        await channelRef.current.send({
          type: "broadcast",
          event: "reaction",
          payload: {
            messageId,
            userId,
            emoji: mine.emoji,
            action: "remove",
          },
        });
      }

      reactionState.current[messageId] ??= {};
      reactionState.current[messageId][emoji] ??= new Set();
      if (action === "add") {
        reactionState.current[messageId][emoji].add(userId);
      } else {
        reactionState.current[messageId][emoji].delete(userId);
      }
      setReactions(aggregateReactions(reactionState.current));

      await channelRef.current.send({
        type: "broadcast",
        event: "reaction",
        payload: { messageId, userId, emoji, action },
      });
    },
    [userId, reactions],
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
