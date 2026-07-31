"use client";

import { useEffect, useState } from "react";

const SATELLITES = [
  {
    size: "h-3 w-3",
    color: "bg-brand",
    glow: "shadow-[0_0_14px_3px_rgba(124,92,255,0.75)]",
    orbit:
      "absolute inset-3 animate-[spin_5s_linear_infinite] motion-reduce:animate-none",
  },
  {
    size: "h-2.5 w-2.5",
    color: "bg-brand-cyan",
    glow: "shadow-[0_0_12px_3px_rgba(34,211,238,0.75)]",
    orbit:
      "absolute inset-9 animate-[spin_7s_linear_infinite_reverse] motion-reduce:animate-none",
  },
  {
    size: "h-2 w-2",
    color: "bg-brand-pink",
    glow: "shadow-[0_0_10px_2px_rgba(255,92,168,0.75)]",
    orbit:
      "absolute inset-0 animate-[spin_4s_linear_infinite] motion-reduce:animate-none",
  },
] as const;

const ECHOES = [0, 1, 2];

export function SearchingAnimation({ messages }: { messages: string[] }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((i) => (i + 1) % messages.length),
      4000,
    );
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-9 py-16">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div className="absolute h-44 w-44 rounded-full bg-brand/25 blur-3xl animate-pulse motion-reduce:animate-none" />
        <div className="absolute h-36 w-36 rounded-full bg-brand-cyan/15 blur-3xl animate-pulse motion-reduce:animate-none [animation-delay:1.1s]" />
        <svg
          className="absolute inset-0 h-full w-full animate-[spin_26s_linear_infinite] motion-reduce:animate-none"
          viewBox="0 0 224 224"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="112"
            cy="112"
            r="108"
            stroke="var(--border-strong, rgba(255,255,255,0.16))"
            strokeWidth="1"
            strokeDasharray="1 7"
          />
        </svg>

        <div
          className="absolute inset-4 rounded-full animate-[spin_7s_linear_infinite] motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 0deg, var(--brand-primary), var(--brand-cyan), var(--brand-pink), var(--brand-primary))",
          }}
        >
          <div className="absolute inset-[3px] rounded-full bg-background" />
        </div>

        <div
          className="absolute inset-10 rounded-full opacity-90 animate-[spin_4s_linear_infinite_reverse] motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 90deg, var(--brand-cyan), transparent 30%, var(--brand-pink) 55%, transparent 85%)",
          }}
        >
          <div className="absolute inset-[2px] rounded-full bg-background" />
        </div>

        {SATELLITES.map((s, si) => (
          <div key={si} className="motion-reduce:hidden">
            {ECHOES.map((echo) => (
              <div
                key={echo}
                className={s.orbit}
                style={{ animationDelay: `-${echo * 0.15}s` }}
              >
                <span
                  className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-full ${s.color} ${s.glow} ${s.size}`}
                  style={{
                    opacity: echo === 0 ? 1 : 1 - echo * 0.35,
                    transform: `translate(-50%, 0) scale(${1 - echo * 0.25})`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-brand via-brand-cyan to-brand-pink animate-breathe">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-40 blur-[2px]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p
          key={msgIndex}
          className="animate-fade-rise-in text-center text-[15px] text-muted"
        >
          {messages[msgIndex]}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {messages.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === msgIndex ? "w-5 bg-brand" : "w-1 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
