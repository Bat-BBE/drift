"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/Avatar";
import { ZODIAC_MARKER, findZodiac } from "@/lib/zodiac";
import { DUEL_START_MARKER, DUEL_MOVE_MARKER } from "@/lib/duel";
import { QUIZ_ANSWER_MARKER } from "@/lib/compatibility";

export interface Message {
  id: string;
  from: "me" | "stranger";
  text: string;
  sentAt: number;
}

export function isHiddenGameMessage(text: string): boolean {
  return (
    text.startsWith(DUEL_START_MARKER) ||
    text.startsWith(DUEL_MOVE_MARKER) ||
    text.startsWith(QUIZ_ANSWER_MARKER)
  );
}

export function ChatBubble({
  message,
  showTime,
  seen,
  seenLabel,
  avatarId,
  pickedLabel,
}: {
  message: Message;
  showTime: boolean;
  seen?: boolean;
  seenLabel?: string;
  avatarId: string;
  pickedLabel?: string;
}) {
  const isMe = message.from === "me";

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
          className={cn(
            "rounded-bubble px-3.5 py-2.5 text-[14px] leading-relaxed animate-bubble-in sm:px-4 sm:py-3 sm:text-[15px]",
            "break-words [overflow-wrap:anywhere]",
            isMe
              ? "bg-brand text-white rounded-br-md"
              : "bg-surface2 text-foreground rounded-bl-md",
          )}
        >
          {message.text}
        </div>
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
