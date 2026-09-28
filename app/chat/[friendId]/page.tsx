"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import type { Message } from "@/components/chat/ChatBubble";
import { MessageActionSheet } from "@/components/chat/MessageActionSheet";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ActionChip } from "@/components/chat/ActionChip";
import { ZodiacPicker } from "@/components/match/ZodiacPicker";
import { ZodiacMatchCard } from "@/components/match/ZodiacMatchCard";
import { DuelGame } from "@/components/chat/DuelGame";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useDirectThread } from "@/hooks/useDirectThread";
import { usePublicProfiles } from "@/hooks/usePublicProfiles";
import { useKeyboardSafeViewport } from "@/hooks/useKeyboardSafeViewport";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useLocale } from "@/lib/i18n";
import { randomIcebreaker } from "@/lib/icebreakers";
import { QUICK_REACTIONS } from "@/lib/quickReactions";
import { ZODIAC_MARKER } from "@/lib/zodiac";
import {
  getLatestDuelRound,
  encodeDuelStart,
  encodeDuelMove,
} from "@/lib/duel";

function DateSeparator({ ts, locale }: { ts: number; locale: string }) {
  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  let label: string;
  if (sameDay(date, today)) {
    label = locale === "mn" ? "Өнөөдөр" : "Today";
  } else if (sameDay(date, yesterday)) {
    label = locale === "mn" ? "Өчигдөр" : "Yesterday";
  } else {
    label = date.toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="flex justify-center py-1.5">
      <span className="rounded-full border border-border bg-surface2/70 px-3 py-1 text-[11px] font-medium text-muted">
        {label}
      </span>
    </div>
  );
}

export default function DirectThreadPage() {
  const { friendId } = useParams<{ friendId: string }>();
  const { userId, ready } = useAnonymousAuth();
  const {
    messages,
    reactions,
    partnerTyping,
    partnerLastReadAt,
    sendMessage,
    deleteMessage,
    toggleReaction,
    notifyTyping,
  } = useDirectThread(userId, friendId);
  const profiles = usePublicProfiles(friendId ? [friendId] : []);
  const { t, locale } = useLocale();
  const keyboardViewport = useKeyboardSafeViewport(true);
  useLockBodyScroll(true);

  const [draft, setDraft] = useState("");
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [actionSheetMessage, setActionSheetMessage] = useState<Message | null>(
    null,
  );
  const [showZodiacPicker, setShowZodiacPicker] = useState(false);
  const [showZodiacCard, setShowZodiacCard] = useState(true);
  const [showDuel, setShowDuel] = useState(false);
  const lastIcebreakerRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const duelRound = getLatestDuelRound(messages);
  const [dismissedDuelRoundId, setDismissedDuelRoundId] = useState<
    string | null
  >(null);
  const duelInvitePending =
    !!duelRound &&
    !showDuel &&
    !duelRound.myMove &&
    !duelRound.theirMove &&
    duelRound.roundId !== dismissedDuelRoundId;

  const myZodiac = messages
    .find((m) => m.from === "me" && m.text.startsWith(ZODIAC_MARKER))
    ?.text.slice(ZODIAC_MARKER.length);
  const partnerZodiac = messages
    .find((m) => m.from === "stranger" && m.text.startsWith(ZODIAC_MARKER))
    ?.text.slice(ZODIAC_MARKER.length);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, partnerTyping, keyboardViewport.height]);

  const fallback = getAvatar(friendId ?? "");
  const profile = profiles[friendId ?? ""];
  const name = profile?.nickname ?? fallback.name;

  function handleSend() {
    if (!draft.trim()) return;
    sendMessage(draft, replyTarget?.id ?? null);
    setDraft("");
    setReplyTarget(null);
  }

  function handleStartDuel() {
    sendMessage(encodeDuelStart(crypto.randomUUID()));
    setShowDuel(true);
  }

  function handleSendIcebreaker() {
    const question = randomIcebreaker(lastIcebreakerRef.current ?? undefined);
    lastIcebreakerRef.current = question;
    sendMessage(question);
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-10 flex h-[100dvh] w-full flex-col bg-surface1 sm:static sm:mx-auto sm:h-[85vh] sm:max-w-lg sm:rounded-lg sm:border sm:border-border sm:shadow-[0_8px_40px_rgba(124,92,255,0.08)]"
      style={
        keyboardViewport.height
          ? {
              height: `${keyboardViewport.height}px`,
              top: `${keyboardViewport.top}px`,
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          href="/chat"
          aria-label={t.backHome}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <Avatar
          id={friendId ?? ""}
          avatarIndex={profile?.avatarIndex}
          size={36}
          minSize={30}
        />
        <p className="truncate text-sm font-medium">{name}</p>
      </div>

      {myZodiac && partnerZodiac && showZodiacCard && (
        <ZodiacMatchCard
          mySign={myZodiac}
          partnerSign={partnerZodiac}
          onClose={() => setShowZodiacCard(false)}
        />
      )}

      <div
        ref={scrollRef}
        className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4"
        role="log"
      >
        {!ready ? (
          <p className="pt-8 text-center text-sm text-muted">{t.loading}</p>
        ) : (
          messages.map((m, i) => {
            const prev = messages[i - 1];
            const showDateSeparator =
              !prev ||
              new Date(prev.sentAt).toDateString() !==
                new Date(m.sentAt).toDateString();
            return (
              <div key={m.id}>
                {showDateSeparator && (
                  <DateSeparator ts={m.sentAt} locale={locale} />
                )}
                <div className="py-1">
                  <ChatBubble
                    message={m}
                    showTime
                    seen={m.from === "me" && partnerLastReadAt >= m.sentAt}
                    avatarId={
                      m.from === "me" ? (userId ?? "me") : (friendId ?? "")
                    }
                    reactions={reactions[m.id] ?? []}
                    myUserId={userId}
                    onToggleReaction={(emoji) => toggleReaction(m.id, emoji)}
                    replyTo={
                      m.replyToId
                        ? (messages.find((x) => x.id === m.replyToId) ?? null)
                        : null
                    }
                    onLongPress={() => setActionSheetMessage(m)}
                  />
                </div>
              </div>
            );
          })
        )}
        {partnerTyping && <TypingIndicator />}
      </div>

      {replyTarget && (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-border bg-surface2/60 px-3 py-2">
          <div className="min-w-0 flex-1 border-l-2 border-brand pl-2">
            <p className="text-[11px] font-medium text-brand">
              {replyTarget.from === "me" ? t.you : name}
            </p>
            <p className="truncate text-xs text-muted">{replyTarget.text}</p>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            aria-label={t.cancel}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {actionSheetMessage && (
        <MessageActionSheet
          message={actionSheetMessage}
          isMine={actionSheetMessage.from === "me"}
          onReact={(emoji) => toggleReaction(actionSheetMessage.id, emoji)}
          onReply={() => setReplyTarget(actionSheetMessage)}
          onDelete={() => deleteMessage(actionSheetMessage.id)}
          onClose={() => setActionSheetMessage(null)}
        />
      )}

      {duelInvitePending && (
        <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-3.5 py-2.5">
          <span className="text-xl">⚔️</span>
          <p className="flex-1 text-xs text-foreground">{t.duelInviteText}</p>
          <button
            onClick={() => setDismissedDuelRoundId(duelRound!.roundId)}
            className="rounded-full px-2.5 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            {t.inviteDecline}
          </button>
          <button
            onClick={() => setShowDuel(true)}
            className="shrink-0 rounded-full bg-gradient-to-r from-brand to-brand-pink px-3 py-1.5 text-xs font-semibold text-white"
          >
            {t.inviteAccept}
          </button>
        </div>
      )}

      {showZodiacPicker && (
        <div className="px-3 pb-2 sm:px-4">
          <ZodiacPicker
            onPick={(name) => {
              sendMessage(`${ZODIAC_MARKER}${name}`);
              setShowZodiacPicker(false);
            }}
            onCancel={() => setShowZodiacPicker(false)}
            title={t.zodiacTitle}
            cancelLabel={t.cancel}
          />
        </div>
      )}

      {showDuel && duelRound && (
        <DuelGame
          round={duelRound}
          onPickMove={(move) =>
            sendMessage(encodeDuelMove(duelRound.roundId, move))
          }
          onClose={() => setShowDuel(false)}
          onRematch={() => sendMessage(encodeDuelStart(crypto.randomUUID()))}
        />
      )}

      <div className="relative border-t border-border">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-surface1 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-surface1 to-transparent" />
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 pt-2 [&::-webkit-scrollbar]:hidden">
            <ActionChip
              icon="🔮"
              label={t.zodiacButton}
              onClick={() => setShowZodiacPicker(true)}
            />
            <ActionChip
              icon="⚔️"
              label={t.duelButton}
              onClick={handleStartDuel}
            />
            <ActionChip
              icon="🎲"
              label={t.icebreaker}
              onClick={handleSendIcebreaker}
            />
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-surface1 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-surface1 to-transparent" />
          <div className="flex items-center gap-1 overflow-x-auto px-3 py-1.5 [&::-webkit-scrollbar]:hidden">
            <span className="mr-1 shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted/70">
              {t.quickReactionsLabel}
            </span>
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendMessage(emoji)}
                aria-label={emoji}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base opacity-80 transition-transform duration-fast hover:scale-125 hover:bg-surface2 hover:opacity-100 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 border-t border-border p-2.5 sm:gap-2 sm:p-3"
        style={{
          paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))",
        }}
      >
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            notifyTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t.messagePlaceholder}
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="off"
          className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-surface2 px-3 text-base outline-none focus-visible:outline-2 focus-visible:outline-brand sm:px-4 sm:text-[15px]"
        />
        <Button
          onClick={handleSend}
          aria-label={t.send}
          className="shrink-0 bg-gradient-to-r from-brand to-brand-pink px-2.5 sm:px-4"
        >
          {t.send}
        </Button>
      </div>
    </div>
  );
}
