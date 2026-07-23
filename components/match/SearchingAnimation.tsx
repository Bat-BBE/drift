"use client";

import { useEffect, useState } from "react";

export function SearchingAnimation({ messages }: { messages: string[] }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-brand/60 animate-pulse-ring [animation-delay:0ms]" />
        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-brand-pink/50 animate-pulse-ring [animation-delay:466ms]" />
        <span className="absolute inline-flex h-full w-full rounded-full border-2 border-brand-cyan/50 animate-pulse-ring [animation-delay:932ms]" />
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand-pink" />
      </div>
      <p className="text-[15px] text-muted transition-opacity duration-base">{messages[msgIndex]}</p>
    </div>
  );
}
