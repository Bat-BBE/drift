"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const TAGS = ["Just Chat", "Music", "Movies", "Language Exchange", "Gaming", "Books", "Travel"];

export function InterestPicker({ onStart }: { onStart: (tags: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(tag: string) {
    setSelected((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  }

  return (
    <div className="w-full max-w-md rounded-md bg-surface1/90 backdrop-blur-xl border border-border p-6">
      <h3 className="font-display text-lg font-semibold">What do you want to talk about?</h3>
      <p className="mt-1 text-sm text-muted">Optional — pick up to 3, or skip and meet anyone.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-fast active:scale-95",
                active
                  ? "border-brand bg-brand/15 text-foreground"
                  : "border-border bg-surface2 text-muted hover:text-foreground"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => onStart([])}>
          Skip
        </Button>
        <Button size="lg" className="flex-1" onClick={() => onStart(selected)}>
          Start chatting
        </Button>
      </div>
    </div>
  );
}
