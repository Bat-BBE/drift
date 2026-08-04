"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/Avatar";
import { ZODIAC_MARKER, findZodiac } from "@/lib/zodiac";
import { DUEL_START_MARKER, DUEL_MOVE_MARKER } from "@/lib/duel";
import { QUIZ_ANSWER_MARKER } from "@/lib/compatibility";
import type { MessageReaction } from "@/hooks/useChatSession";

export interface Message {
  id: string;
  from: "me" | "stranger";
  text: string;
  sentAt: number;
  flagged?: boolean;
  flagReason?: "keyword" | "link" | null;
  replyToId?: string | null;
}

export function isHiddenGameMessage(text: string): boolean {
  return (
    text.startsWith(DUEL_START_MARKER) ||
    text.startsWith(DUEL_MOVE_MARKER) ||
    text.startsWith(QUIZ_ANSWER_MARKER)
  );
}

const LONG_PRESS_MS = 450;

export function ChatBubble({
  message,
  showTime,
  seen,
  seenLabel,
  avatarId,
  pickedLabel,
  reactions = [],
  myUserId,
  replyTo,
  youLabel = "Та",
  themLabel = "Тэр",
  flaggedTooltip = "Энэ мессеж линк эсвэл сэжигтэй агуулга агуулж болзошгүй",
  onLongPress,
  onToggleReaction,
}: {
  message: Message;
  showTime: boolean;
  seen?: boolean;
  seenLabel?: string;
  avatarId: string;
  pickedLabel?: string;
  reactions?: MessageReaction[];
  myUserId?: string | null;
  replyTo?: Message | null;
  youLabel?: string;
  themLabel?: string;
  flaggedTooltip?: string;
  onLongPress?: () => void;
  onToggleReaction?: (emoji: string) => void;
}) {
  const isMe = message.from === "me";
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressMoved = useRef(false);

  if (isHiddenGameMessage(message.text)) {
    return null;
  }

  if (message.text.startsWith(ZODIAC_MARKER)) {
    const name = message.text.slice(ZODIAC_MARKER.length);
    const sign = findZodiac(name);
    return (
      <div className="flex justify-center px-4 py-1">
        <span className="max-w-full break-words rounded-full border border-border bg-surface2 px-3 py-1.5 text-center text-xs text-muted">
          {sign?.emoji ?? "🔮"} {pickedLabel}{" "}
          <span className="font-medium text-foreground">{name}</span>
        </span>
      </div>
    );
  }

  function startPress() {
    pressMoved.current = false;
    pressTimer.current = setTimeout(() => {
      if (!pressMoved.current) onLongPress?.();
    }, LONG_PRESS_MS);
  }

  function cancelPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  return (
    <div
      className={cn(
        "flex w-full items-end gap-1.5 px-2 sm:gap-2 sm:px-0",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      {!isMe && (
        <Avatar
          id={avatarId}
          size={28}
          minSize={24}
          className="hidden xs:inline-flex"
        />
      )}
      <div
        className={cn(
          "flex min-w-0 max-w-[82%] flex-col sm:max-w-[75%]",
          isMe ? "items-end" : "items-start",
        )}
      >
        <div
          onPointerDown={startPress}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
          onPointerCancel={cancelPress}
          onPointerMove={() => {
            pressMoved.current = true;
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            onLongPress?.();
          }}
          className={cn(
            "select-none rounded-bubble px-3.5 py-2.5 text-[14px] leading-relaxed animate-bubble-in sm:px-4 sm:py-3 sm:text-[15px]",
            "break-words [overflow-wrap:anywhere]",
            isMe
              ? "bg-brand text-white rounded-br-md"
              : "bg-surface2 text-foreground rounded-bl-md",
          )}
        >
          {replyTo && (
            <div
              className={cn(
                "mb-1.5 rounded-lg border-l-2 px-2 py-1 text-xs",
                isMe
                  ? "border-white/50 bg-white/10 text-white/80"
                  : "border-brand bg-surface1/60 text-muted",
              )}
            >
              <p className="font-medium">
                {replyTo.from === "me" ? youLabel : themLabel}
              </p>
              <p className="truncate opacity-90">
                {isHiddenGameMessage(replyTo.text) ? "🎮" : replyTo.text}
              </p>
            </div>
          )}

          <span className="align-middle">{message.text}</span>
          {message.flagged && (
            <span
              title={flaggedTooltip}
              aria-label={flaggedTooltip}
              className={cn(
                "ml-1.5 inline-block align-middle text-xs",
                isMe ? "opacity-80" : "opacity-70",
              )}
            >
              ⚠️
            </span>
          )}
        </div>

        {reactions.length > 0 && (
          <div
            className={cn(
              "-mt-1 flex flex-wrap gap-1 px-1",
              isMe ? "justify-end" : "justify-start",
            )}
          >
            {reactions.map((r) => {
              const mine = !!myUserId && r.userIds.includes(myUserId);
              return (
                <button
                  key={r.emoji}
                  onClick={() => onToggleReaction?.(r.emoji)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors",
                    mine
                      ? "border-brand bg-brand/15 text-foreground"
                      : "border-border bg-surface1 text-muted hover:bg-surface2",
                  )}
                >
                  <span>{r.emoji}</span>
                  {r.userIds.length > 1 && <span>{r.userIds.length}</span>}
                </button>
              );
            })}
          </div>
        )}

        {showTime && (
          <span className="mt-1 flex items-center gap-1 px-1 font-mono text-[10px] text-muted sm:text-[11px]">
            {new Date(message.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {seen && seenLabel && (
              <span className="text-brand-cyan">· {seenLabel} ✓✓</span>
            )}
          </span>
        )}
      </div>
      {isMe && (
        <Avatar
          id={avatarId}
          size={28}
          minSize={24}
          className="hidden xs:inline-flex"
        />
      )}
    </div>
  );
}
