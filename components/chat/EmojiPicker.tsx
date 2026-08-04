"use client";

import { useState } from "react";

const CATEGORIES: { id: string; icon: string; emojis: string[] }[] = [
  {
    id: "smileys",
    icon: "😀",
    emojis: [
      "😀",
      "😂",
      "🥰",
      "😍",
      "😘",
      "😎",
      "🤩",
      "😊",
      "🙂",
      "😉",
      "😜",
      "🤪",
      "😇",
      "🥺",
      "😭",
      "😢",
      "😤",
      "😡",
      "🤔",
      "😴",
      "🤗",
      "🙃",
      "😏",
      "😳",
      "🥴",
      "🤯",
      "😱",
      "🥶",
      "🤒",
      "😷",
    ],
  },
  {
    id: "hearts",
    icon: "❤️",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💔",
      "❤️‍🔥",
      "❤️‍🩹",
      "💌",
      "😻",
    ],
  },
  {
    id: "gestures",
    icon: "👍",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤝",
      "🙏",
      "👏",
      "🙌",
      "💪",
      "👋",
      "🤙",
      "✋",
      "👊",
      "🫶",
      "🤟",
      "🖕",
      "☝️",
      "👉",
      "👈",
    ],
  },
  {
    id: "animals",
    icon: "🐶",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐸",
      "🐵",
      "🦄",
      "🐔",
      "🐧",
      "🦉",
      "🦋",
      "🐢",
      "🐬",
    ],
  },
  {
    id: "food",
    icon: "🍕",
    emojis: [
      "🍕",
      "🍔",
      "🍟",
      "🌭",
      "🍿",
      "🍩",
      "🍪",
      "🍰",
      "🎂",
      "🍫",
      "🍦",
      "🍭",
      "🍎",
      "🍓",
      "🍉",
      "🍇",
      "☕",
      "🧋",
      "🍺",
      "🍻",
    ],
  },
  {
    id: "activities",
    icon: "🔥",
    emojis: [
      "🔥",
      "✨",
      "⭐",
      "🎉",
      "🎊",
      "💯",
      "⚡",
      "💫",
      "🌈",
      "☀️",
      "🌙",
      "⚽",
      "🎮",
      "🎵",
      "🎬",
      "📸",
      "✈️",
      "🏆",
      "🎯",
      "💡",
    ],
  },
];

export function EmojiPicker({
  onPick,
  onClose,
}: {
  onPick: (emoji: string) => void;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-quiz-sheet-in rounded-t-2xl border border-border bg-surface1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.3)] sm:rounded-2xl sm:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Emoji сонгох</p>
          <button
            onClick={onClose}
            aria-label="Хаах"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1 p-3 sm:grid-cols-8">
          {CATEGORIES[activeCategory].emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onPick(emoji)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl transition-transform hover:scale-110 hover:bg-surface2 active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(i)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition-colors ${
                i === activeCategory ? "bg-brand/15" : "hover:bg-surface2"
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
