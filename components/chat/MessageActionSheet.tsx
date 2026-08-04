"use client";

import { useState } from "react";
import type { Message } from "@/components/chat/ChatBubble";
import { EmojiPicker } from "@/components/chat/EmojiPicker";

const QUICK_PICK = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export function MessageActionSheet({
  message,
  isMine,
  onReact,
  onReply,
  onDelete,
  onClose,
}: {
  message: Message;
  isMine: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(message.text).catch(() => {});
    setCopied(true);
    setTimeout(onClose, 500);
  }

  function pickReaction(emoji: string) {
    onReact(emoji);
    onClose();
  }

  if (showFullPicker) {
    return (
      <EmojiPicker
        onPick={(emoji) => {
          onReact(emoji);
          onClose();
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-quiz-sheet-in rounded-t-2xl border border-border bg-surface1 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-8px_40px_rgba(0,0,0,0.3)] sm:rounded-2xl sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-1.5">
          {QUICK_PICK.map((emoji) => (
            <button
              key={emoji}
              onClick={() => pickReaction(emoji)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-2xl transition-transform hover:scale-110 hover:bg-surface2 active:scale-95"
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowFullPicker(true)}
            aria-label="Бусад emoji"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-lg text-muted transition-colors hover:bg-surface2 hover:text-foreground"
          >
            ➕
          </button>
        </div>

        <div className="mt-3 flex flex-col overflow-hidden rounded-2xl border border-border">
          <button
            onClick={() => {
              onReply();
              onClose();
            }}
            className="flex items-center gap-3 border-b border-border bg-surface2/50 px-4 py-3 text-left text-sm transition-colors hover:bg-surface2"
          >
            <span aria-hidden>↩️</span> Хариулах
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 border-b border-border bg-surface2/50 px-4 py-3 text-left text-sm transition-colors hover:bg-surface2"
          >
            <span aria-hidden>📋</span> {copied ? "Хуулагдлаа ✓" : "Хуулах"}
          </button>
          {isMine && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex items-center gap-3 bg-surface2/50 px-4 py-3 text-left text-sm text-danger transition-colors hover:bg-danger/10"
            >
              <span aria-hidden>🗑️</span> Устгах
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-full py-2.5 text-center text-sm text-muted transition-colors hover:text-foreground"
        >
          Цуцлах
        </button>
      </div>
    </div>
  );
}
