"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SearchingAnimation } from "@/components/match/SearchingAnimation";
import { MatchFoundBurst } from "@/components/match/MatchFoundBurst";
import { RateSheet } from "@/components/match/RateSheet";
import { ReportSheet } from "@/components/match/ReportSheet";
import { TopControls } from "@/components/shared/TopControls";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useChatSession } from "@/hooks/useChatSession";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { randomIcebreaker } from "@/lib/icebreakers";
import { QUICK_REACTIONS } from "@/lib/quickReactions";
import { ZodiacPicker } from "@/components/match/ZodiacPicker";
import { ZodiacMatchCard } from "@/components/match/ZodiacMatchCard";
import { ZODIAC_MARKER } from "@/lib/zodiac";

type Phase =
  | "searching"
  | "matched"
  | "chat"
  | "disconnected"
  | "reported"
  | "rate"
  | "noMatch";

export default function MatchPage() {
  const router = useRouter();
  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { userId, ready } = useAnonymousAuth();
  const { status, session, startSearch, cancelSearch, resetSession } =
    useMatchmaking(userId);
  const {
    messages,
    partnerTyping,
    partnerDisconnected,
    partnerLastReadAt,
    sendMessage,
    notifyTyping,
    leaveSession,
    reportSession,
    rateSession,
    deleteSession,
  } = useChatSession(session?.id ?? null, userId, session?.partnerId ?? null);

  const [phase, setPhase] = useState<Phase>("searching");
  const [draft, setDraft] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showZodiacPicker, setShowZodiacPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const searchingMessages = [
    t.searching1,
    t.searching2,
    t.searching3,
    t.searching4,
  ];

  const myZodiac = messages
    .find((m) => m.from === "me" && m.text.startsWith(ZODIAC_MARKER))
    ?.text.slice(ZODIAC_MARKER.length);
  const partnerZodiac = messages
    .find((m) => m.from === "stranger" && m.text.startsWith(ZODIAC_MARKER))
    ?.text.slice(ZODIAC_MARKER.length);
  // const compatibility =
  //   myZodiac && partnerZodiac
  //     ? getCompatibility(myZodiac, partnerZodiac)
  //     : null;

  useEffect(() => {
    if (ready && userId && !hasStarted.current) {
      hasStarted.current = true;
      startSearch([]);
    }
  }, [ready, userId, startSearch]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, partnerTyping]);

  useEffect(() => {
    if (status === "matched" && phase === "searching") {
      setPhase("matched");
    }
  }, [status]);

  useEffect(() => {
    if (phase !== "matched") return;
    const matchTimer = setTimeout(() => setPhase("chat"), 1500);
    return () => clearTimeout(matchTimer);
  }, [phase]);

  useEffect(() => {
    if (partnerDisconnected && phase === "chat") {
      setPhase("disconnected");
    }
  }, [partnerDisconnected, phase]);

  useEffect(() => {
    if (phase !== "searching") return;
    const noMatchTimer = setTimeout(async () => {
      await cancelSearch();
      setPhase("noMatch");
    }, 20000);
    return () => clearTimeout(noMatchTimer);
  }, [phase, cancelSearch]);

  // 30 sec: no messages -> auto leave + jump to next match
  useEffect(() => {
    if (phase !== "chat") return;
    const idleTimer = setTimeout(async () => {
      await leaveSession();
      handleNextMatch();
    }, 30000);
    return () => clearTimeout(idleTimer);
  }, [phase, messages]);

  async function handleCancelSearch() {
    await cancelSearch();
    router.push("/");
  }

  async function handleSend() {
    if (!draft.trim()) return;
    await sendMessage(draft);
    setDraft("");
  }

  async function handleLeave() {
    await leaveSession();
    setPhase("rate");
  }

  async function handleReport(reason: string) {
    if (!session) return;
    await reportSession(reason, session.partnerId);
    setShowReport(false);
    setPhase("reported");
  }

  async function handleRate(value: "up" | "down") {
    if (!session) return;
    await rateSession(value, session.partnerId);
  }

  async function handleNextMatch() {
    await deleteSession();
    resetSession();
    hasStarted.current = false;
    setPhase("searching");
    startSearch([]);
    hasStarted.current = true;
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">{t.connecting}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <TopControls
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {phase === "searching" && (
        <div className="flex flex-col items-center">
          <SearchingAnimation messages={searchingMessages} />

          <button
            onClick={handleCancelSearch}
            className="text-sm text-muted hover:text-foreground"
          >
            {t.cancelSearch}
          </button>
        </div>
      )}

      {phase === "matched" && session && (
        <MatchFoundBurst
          partnerId={session.partnerId}
          sharedTags={session.sharedTags}
          label={t.matchFound}
        />
      )}

      {phase === "noMatch" && (
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-6 text-center">
          <h3 className="font-display text-lg font-semibold">
            {t.noMatchTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.noMatchSubtitle}</p>
          <Button
            size="lg"
            className="mt-6 p-2 w-full bg-gradient-to-r from-brand to-brand-pink"
            onClick={handleNextMatch}
          >
            {t.tryAgain}
          </Button>
        </div>
      )}

      {phase === "chat" && session && !showReport && !showZodiacPicker && (
        <div className="flex h-[85vh] w-full max-w-lg flex-col rounded-lg border border-border bg-surface1 shadow-[0_8px_40px_rgba(124,92,255,0.08)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative">
                <Avatar id={session.partnerId} size={36} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface1 bg-success" />
              </span>
              <span className="text-sm font-medium">
                {getAvatar(session.partnerId).name}
              </span>
            </div>
            <button
              onClick={() => setShowReport(true)}
              aria-label={t.reportTitle}
              className="rounded-sm p-2 text-muted transition-colors hover:bg-surface2 hover:text-danger"
            >
              ⚑
            </button>
          </div>

          {myZodiac && partnerZodiac && (
            <ZodiacMatchCard mySign={myZodiac} partnerSign={partnerZodiac} />
          )}

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            role="log"
          >
            {messages.map((m, i) => (
              <ChatBubble
                key={m.id}
                message={m}
                showTime={i === messages.length - 1}
                seen={m.from === "me" && partnerLastReadAt >= m.sentAt}
                seenLabel={t.seen}
                avatarId={
                  m.from === "me" ? (userId ?? "me") : session.partnerId
                }
              />
            ))}
            {partnerTyping && <TypingIndicator />}
          </div>

          <div className="flex items-center gap-1 px-3 pt-2">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendMessage(emoji)}
                className="rounded-sm p-1 text-lg transition-transform duration-fast hover:scale-125 active:scale-95"
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={() => setShowZodiacPicker(true)}
              title={t.zodiacButton}
              className="rounded-full border border-border bg-surface2 px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              🔮 {t.zodiacButton}
            </button>
            <button
              onClick={() => sendMessage(randomIcebreaker())}
              title={t.icebreaker}
              className="ml-auto rounded-full border border-border bg-surface2 px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              🎲 {t.icebreaker}
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                notifyTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.typeMessage}
              className="h-11 flex-1 rounded-sm border border-border bg-surface2 px-4 text-[15px] outline-none focus-visible:outline-2 focus-visible:outline-brand"
            />
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-brand to-brand-pink"
            >
              {t.send}
            </Button>
            <Button variant="secondary" onClick={handleLeave}>
              {t.leave}
            </Button>
          </div>
        </div>
      )}

      {phase === "chat" && showZodiacPicker && (
        <ZodiacPicker
          onPick={(name) => {
            sendMessage(`${ZODIAC_MARKER}${name}`);
            setShowZodiacPicker(false);
          }}
          onCancel={() => setShowZodiacPicker(false)}
          title={t.zodiacTitle}
          cancelLabel={t.cancel}
        />
      )}

      {phase === "chat" && showReport && (
        <ReportSheet
          onReport={handleReport}
          onCancel={() => setShowReport(false)}
          title={t.reportTitle}
          subtitle={t.reportSubtitle}
          reasons={t.reportReasons}
          cancelLabel={t.cancel}
        />
      )}

      {phase === "disconnected" && (
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-6 text-center">
          <h3 className="font-display text-lg font-semibold">
            {t.disconnectedTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.disconnectedSubtitle}</p>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => setPhase("rate")}
          >
            {t.continue}
          </Button>
        </div>
      )}

      {phase === "reported" && (
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-6 text-center">
          <h3 className="font-display text-lg font-semibold">
            {t.reportedTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.reportedSubtitle}</p>
          <Button size="lg" className="mt-6 w-full" onClick={handleNextMatch}>
            {t.findNewMatch}
          </Button>
        </div>
      )}

      {phase === "rate" && (
        <RateSheet
          onRate={handleRate}
          onNext={handleNextMatch}
          title={t.rateTitle}
          subtitle={t.rateSubtitle}
          goodLabel={t.good}
          notGreatLabel={t.notGreat}
          nextLabel={t.nextMatch}
        />
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-6 text-xs text-muted hover:text-foreground"
      >
        {t.backHome}
      </button>
    </main>
  );
}
