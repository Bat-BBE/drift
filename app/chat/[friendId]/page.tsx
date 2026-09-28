"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useDirectThread } from "@/hooks/useDirectThread";
import { usePublicProfiles } from "@/hooks/usePublicProfiles";
import { useLocale } from "@/lib/i18n";

export default function DirectThreadPage() {
  const { friendId } = useParams<{ friendId: string }>();
  const { userId, ready } = useAnonymousAuth();
  const { messages, sendMessage } = useDirectThread(userId, friendId);
  const profiles = usePublicProfiles(friendId ? [friendId] : []);
  const { t } = useLocale();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const fallback = getAvatar(friendId ?? "");
  const profile = profiles[friendId ?? ""];
  const name = profile?.nickname ?? fallback.name;

  function handleSend() {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  }

  return (
    <AppShell>
      <main className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-0 lg:px-10 lg:py-6">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3 lg:rounded-t-2xl lg:border lg:bg-surface1/60">
          <Link
            href="/chat"
            aria-label={t.backHome}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <Avatar id={friendId ?? ""} avatarIndex={profile?.avatarIndex} size={36} />
          <p className="truncate text-sm font-semibold">{name}</p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3 lg:border-x lg:border-border lg:bg-surface1/60 lg:px-4"
        >
          {!ready ? (
            <p className="pt-8 text-center text-sm text-muted">{t.loading}</p>
          ) : (
            messages.map((m, i) => (
              <ChatBubble
                key={m.id}
                message={m}
                showTime={i === messages.length - 1}
                avatarId={m.from === "me" ? (userId ?? "me") : (friendId ?? "")}
              />
            ))
          )}
        </div>

        <div
          className="flex items-center gap-2 border-t border-border p-2.5 lg:rounded-b-2xl lg:border-x lg:border-b lg:bg-surface1/60 lg:px-4 lg:py-3"
          style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.messagePlaceholder}
            enterKeyHint="send"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-surface2 px-4 text-base outline-none focus-visible:outline-2 focus-visible:outline-brand sm:text-[15px]"
          />
          <Button
            onClick={handleSend}
            aria-label={t.send}
            className="shrink-0 rounded-full bg-gradient-to-r from-brand to-brand-pink px-4"
          >
            {t.send}
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
