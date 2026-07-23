"use client";

import { useEffect, useState } from "react";

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
    <div className="flex flex-col items-center justify-center gap-10 py-16">
      <div className="relative flex h-48 w-48 items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full bg-brand/30 blur-3xl animate-pulse" />

        <div
          className="absolute inset-0 rounded-full animate-[spin_7s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, var(--brand-primary), var(--brand-cyan), var(--brand-pink), var(--brand-primary))",
          }}
        >
          <div className="absolute inset-[3px] rounded-full bg-background" />
        </div>

        <div
          className="absolute inset-6 rounded-full opacity-80 animate-[spin_4s_linear_infinite_reverse]"
          style={{
            background:
              "conic-gradient(from 90deg, var(--brand-cyan), transparent 35%, var(--brand-pink) 60%, transparent 90%)",
          }}
        >
          <div className="absolute inset-[2px] rounded-full bg-background" />
        </div>

        <div className="absolute inset-2 animate-[spin_5s_linear_infinite]">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-cyan shadow-[0_0_10px_2px_rgba(76,201,240,0.7)]" />
        </div>
        <div className="absolute inset-2 animate-[spin_6s_linear_infinite_reverse]">
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-pink shadow-[0_0_10px_2px_rgba(255,92,168,0.7)]" />
        </div>
        <div className="absolute inset-0 animate-[spin_9s_linear_infinite]">
          <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_8px_2px_rgba(124,92,255,0.7)]" />
        </div>

        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-brand via-brand-cyan to-brand-pink animate-breathe" />
      </div>

      <p className="text-[15px] text-muted transition-opacity duration-base">
        {messages[msgIndex]}
      </p>
    </div>
  );
}
