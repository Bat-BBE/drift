"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/Avatar";

export interface Message {
  id: string;
  from: "me" | "stranger";
  text: string;
  sentAt: number;
}

export function ChatBubble({
  message,
  showTime,
  seen,
  seenLabel,
  avatarId,
}: {
  message: Message;
  showTime: boolean;
  seen?: boolean;
  seenLabel?: string;
  avatarId: string;
}) {
  const isMe = message.from === "me";
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      {!isMe && <Avatar id={avatarId} size={28} />}
      <div
        className={cn(
          "flex max-w-[75%] flex-col",
          isMe ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-bubble px-4 py-3 text-[15px] leading-relaxed animate-bubble-in",
            isMe
              ? "bg-brand text-white rounded-br-md"
              : "bg-surface2 text-foreground rounded-bl-md",
          )}
        >
          {message.text}
        </div>
        {showTime && (
          <span className="mt-1 flex items-center gap-1 px-1 font-mono text-[11px] text-muted">
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
      {isMe && <Avatar id={avatarId} size={28} />}
    </div>
  );
}
