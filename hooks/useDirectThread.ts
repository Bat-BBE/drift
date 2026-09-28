"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message } from "@/components/chat/ChatBubble";
import type { MessageReaction } from "@/hooks/useChatSession";

// DM history is persisted (unlike random-match chat) — every send/react/
// delete writes to the database first, and is also broadcast on a
// per-pair realtime channel so the other person's open thread updates
// live without relying on postgres_changes filtering across every one of
// their conversations.
function pairChannelName(a: string, b: string) {
  return `dm:${[a, b].sort().join(":")}`;
}

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

export function useDirectThread(
  myUserId: string | null,
  friendId: string | null,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>(
    {},
  );
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerLastReadAt, setPartnerLastReadAt] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionState = useRef<Record<string, Record<string, Set<string>>>>(
    {},
  );

  useEffect(() => {
    if (!myUserId || !friendId) return;
    const uid = myUserId;
    const fid = friendId;
    let cancelled = false;

    setMessages([]);
    setReactions({});
    reactionState.current = {};
    setPartnerLastReadAt(0);
    setLoading(true);

    async function load() {
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${uid},recipient_id.eq.${fid}),and(sender_id.eq.${fid},recipient_id.eq.${uid})`,
        )
        .order("sent_at", { ascending: true });

      if (cancelled) return;
      const ids = (data ?? []).map((m: any) => m.id);
      if (data) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            from: m.sender_id === uid ? "me" : "stranger",
            text: m.content,
            sentAt: new Date(m.sent_at).getTime(),
            replyToId: m.reply_to_id,
          })),
        );
      }

      if (ids.length > 0) {
        const { data: reactionRows } = await supabase
          .from("direct_message_reactions")
          .select("message_id, user_id, emoji")
          .in("message_id", ids);
        if (!cancelled && reactionRows) {
          const byMessage: Record<string, Record<string, Set<string>>> = {};
          for (const row of reactionRows as any[]) {
            byMessage[row.message_id] ??= {};
            byMessage[row.message_id][row.emoji] ??= new Set();
            byMessage[row.message_id][row.emoji].add(row.user_id);
          }
          reactionState.current = byMessage;
          setReactions(aggregateReactions(byMessage));
        }
      }

      if (!cancelled) setLoading(false);
    }
    load();

    const channel = supabase
      .channel(pairChannelName(uid, fid), { config: { private: true } })
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
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [myUserId, friendId]);

  // Mark the thread read — both a live broadcast (instant "seen ✓✓" for
  // the other person, while they're actively in the thread) and a
  // persisted marker (so the unread badge on the Chat tab stays correct
  // across reloads, even when nobody's watching live).
  useEffect(() => {
    if (!myUserId || !friendId || messages.length === 0 || loading) return;
    const now = Date.now();
    channelRef.current?.send({
      type: "broadcast",
      event: "read",
      payload: { userId: myUserId, at: now },
    });
    supabase.from("direct_message_reads").upsert(
      {
        user_id: myUserId,
        friend_id: friendId,
        last_read_at: new Date(now).toISOString(),
      },
      { onConflict: "user_id,friend_id" },
    );
  }, [myUserId, friendId, messages.length, loading]);

  const sendMessage = useCallback(
    async (content: string, replyToId?: string | null) => {
      const trimmed = content.trim();
      if (!myUserId || !friendId || !trimmed) return;

      const optimisticId = crypto.randomUUID();
      const now = Date.now();
      const optimistic: Message = {
        id: optimisticId,
        from: "me",
        text: trimmed,
        sentAt: now,
        replyToId: replyToId ?? null,
      };
      setMessages((prev) => [...prev, optimistic]);

      const { data, error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: myUserId,
          recipient_id: friendId,
          content: trimmed,
          reply_to_id: replyToId ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("[drift] failed to send DM:", error.message);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        return;
      }

      const finalId = data?.id ?? optimisticId;
      const sentAt = data ? new Date(data.sent_at).getTime() : now;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, id: finalId, sentAt } : m,
        ),
      );

      await channelRef.current?.send({
        type: "broadcast",
        event: "message",
        payload: {
          id: finalId,
          from: "me",
          text: trimmed,
          sentAt,
          replyToId: replyToId ?? null,
          senderId: myUserId,
        },
      });
    },
    [myUserId, friendId],
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      await supabase.from("direct_messages").delete().eq("id", messageId);
      await channelRef.current?.send({
        type: "broadcast",
        event: "delete-message",
        payload: { messageId, senderId: myUserId },
      });
    },
    [myUserId],
  );

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!myUserId) return;
      const mine = reactions[messageId]?.find((r) =>
        r.userIds.includes(myUserId),
      );
      const action: "add" | "remove" =
        mine && mine.emoji === emoji ? "remove" : "add";

      if (mine && mine.emoji !== emoji) {
        reactionState.current[messageId] ??= {};
        reactionState.current[messageId][mine.emoji] ??= new Set();
        reactionState.current[messageId][mine.emoji].delete(myUserId);
        await supabase
          .from("direct_message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", myUserId);
        await channelRef.current?.send({
          type: "broadcast",
          event: "reaction",
          payload: {
            messageId,
            userId: myUserId,
            emoji: mine.emoji,
            action: "remove",
          },
        });
      }

      reactionState.current[messageId] ??= {};
      reactionState.current[messageId][emoji] ??= new Set();
      if (action === "add") {
        reactionState.current[messageId][emoji].add(myUserId);
        await supabase.from("direct_message_reactions").upsert(
          { message_id: messageId, user_id: myUserId, emoji },
          { onConflict: "message_id,user_id" },
        );
      } else {
        reactionState.current[messageId][emoji].delete(myUserId);
        await supabase
          .from("direct_message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", myUserId);
      }
      setReactions(aggregateReactions(reactionState.current));

      await channelRef.current?.send({
        type: "broadcast",
        event: "reaction",
        payload: { messageId, userId: myUserId, emoji, action },
      });
    },
    [myUserId, reactions],
  );

  const notifyTyping = useCallback(() => {
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: myUserId },
    });
  }, [myUserId]);

  return {
    messages,
    reactions,
    partnerTyping,
    partnerLastReadAt,
    loading,
    sendMessage,
    deleteMessage,
    toggleReaction,
    notifyTyping,
  };
}
