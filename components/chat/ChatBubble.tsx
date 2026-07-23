"use client";

import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  from: "me" | "stranger";
  text: string;
  sentAt: number;
}

export function ChatBubble({ message, showTime }: { message: Message; showTime: boolean }) {
  const isMe = message.from === "me";
  return (
    <div className={cn("flex flex-col animate-bubble-in", isMe ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-bubble px-4 py-3 text-[15px] leading-relaxed",
          isMe
            ? "bg-brand text-white rounded-br-md"
            : "bg-surface2 text-foreground rounded-bl-md"
        )}
      >
        {message.text}
      </div>
      {showTime && (
        <span className="mt-1 px-1 font-mono text-[11px] text-muted">
          {new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  );
}
