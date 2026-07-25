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

/**
 * Mobile дээр keyboard нээгдэхэд visualViewport-ийн бодит өндөр (height)
 * БОЛОН шилжилт (offsetTop)-ийг хамт хянана. iOS Safari keyboard
 * нээгдэхэд зөвхөн height өөрчлөгддөггүй, visualViewport өөрөө
 * layout viewport-оос "гулсдаг" (offsetTop > 0) тул үүнийг дагаагүй бол
 * fixed container нь дэлгэцээс дээшээ гарсан мэт харагддаг.
 */
function useKeyboardSafeViewport(active: boolean) {
  const [vv, setVv] = useState<{ height: number | null; top: number }>({
    height: null,
    top: 0,
  });

  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    function update() {
      if (window.innerWidth < 640) {
        setVv({ height: viewport!.height, top: viewport!.offsetTop });
      } else {
        setVv({ height: null, top: 0 });
      }
    }

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  return vv;
}

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
  const [showZodiacCard, setShowZodiacCard] = useState(true);
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

  const isChatFullBleed = phase === "chat";
  const keyboardViewport = useKeyboardSafeViewport(isChatFullBleed);

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
  }, [messages, partnerTyping, keyboardViewport.height]);

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

  const IDLE_TIMEOUT_MS = 180_000;
  useEffect(() => {
    if (phase !== "chat") return;
    const idleTimer = setTimeout(async () => {
      await leaveSession();
      handleNextMatch();
    }, IDLE_TIMEOUT_MS);
    return () => clearTimeout(idleTimer);
  }, [phase, messages]);

  useEffect(() => {
    if (isChatFullBleed) {
      const originalOverflow = document.body.style.overflow;
      const originalOverscroll = document.body.style.overscrollBehavior;
      const originalPosition = document.body.style.position;
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        document.body.style.position = originalPosition;
        document.body.style.width = "";
      };
    }
  }, [isChatFullBleed]);

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
      <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <p className="text-sm text-muted">{t.connecting}</p>
      </main>
    );
  }

  return (
    <main
      className={`flex min-h-[100dvh] flex-col items-center bg-background ${
        isChatFullBleed
          ? "justify-start px-0 py-0 sm:justify-center sm:px-4 sm:py-8"
          : "justify-center px-4 py-8"
      }`}
    >
      <div
        className={
          isChatFullBleed
            ? "w-full px-3 pt-3 sm:w-auto sm:px-0 sm:pt-0"
            : undefined
        }
      >
        <TopControls
          locale={locale}
          onToggleLocale={toggleLocale}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {phase === "searching" && (
        <div className="flex flex-col items-center px-4">
          <SearchingAnimation messages={searchingMessages} />
          <button
            onClick={handleCancelSearch}
            className="mt-2 text-sm text-muted hover:text-foreground"
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
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-5 text-center sm:p-6">
          <h3 className="font-display text-lg font-semibold">
            {t.noMatchTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.noMatchSubtitle}</p>
          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-brand to-brand-pink p-2"
            onClick={handleNextMatch}
          >
            {t.tryAgain}
          </Button>
        </div>
      )}

      {phase === "chat" && session && !showReport && !showZodiacPicker && (
        <div
          className="fixed inset-x-0 top-0 z-10 flex h-[100dvh] w-full flex-col border-border bg-surface1 sm:static sm:h-[85vh] sm:max-w-lg sm:rounded-lg sm:border sm:shadow-[0_8px_40px_rgba(124,92,255,0.08)]"
          style={
            keyboardViewport.height
              ? {
                  height: `${keyboardViewport.height}px`,
                  top: `${keyboardViewport.top}px`,
                }
              : undefined
          }
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <span className="relative shrink-0">
                <Avatar id={session.partnerId} size={36} minSize={30} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface1 bg-success" />
              </span>
              <span className="truncate text-sm font-medium">
                {getAvatar(session.partnerId).name}
              </span>
            </div>
            <button
              onClick={() => setShowReport(true)}
              aria-label={t.reportTitle}
              className="shrink-0 rounded-sm p-2 text-muted transition-colors hover:bg-surface2 hover:text-danger"
            >
              ⚑
            </button>
          </div>

          {myZodiac && partnerZodiac && showZodiacCard && (
            <ZodiacMatchCard
              mySign={myZodiac}
              partnerSign={partnerZodiac}
              onClose={() => setShowZodiacCard(false)}
            />
          )}

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4"
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

          <div className="flex items-center gap-1 overflow-x-auto px-2.5 pt-2 sm:gap-1 sm:px-3 [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setShowZodiacPicker(true)}
              title={t.zodiacButton}
              className="ml-1 shrink-0 rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs text-muted transition-colors hover:text-foreground sm:px-3"
            >
              🔮 <span className="hidden sm:inline">{t.zodiacButton}</span>
            </button>
            <button
              onClick={() => sendMessage(randomIcebreaker())}
              title={t.icebreaker}
              className="ml-auto shrink-0 rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs text-muted transition-colors hover:text-foreground sm:px-3"
            >
              🎲 <span className="hidden sm:inline">{t.icebreaker}</span>
            </button>
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendMessage(emoji)}
                className="shrink-0 rounded-sm p-1 text-lg transition-transform duration-fast hover:scale-125 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-1.5 border-t border-border p-2.5 sm:gap-2 sm:p-3"
            style={{
              paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))",
            }}
          >
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                notifyTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.typeMessage}
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-surface2 px-3 text-base outline-none focus-visible:outline-2 focus-visible:outline-brand sm:px-4 sm:text-[15px]"
            />
            <Button
              onClick={handleSend}
              aria-label={t.send}
              className="shrink-0 bg-gradient-to-r from-brand to-brand-pink px-2.5 sm:px-4"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:hidden"
                aria-hidden
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
              </svg>
              <span className="hidden sm:inline">{t.send}</span>
            </Button>
            <Button
              variant="secondary"
              aria-label={t.leave}
              className="shrink-0 px-2.5 sm:px-4"
              onClick={handleLeave}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:hidden"
                aria-hidden
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span className="hidden sm:inline">{t.leave}</span>
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
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-5 text-center sm:p-6">
          <h3 className="font-display text-lg font-semibold">
            {t.disconnectedTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.disconnectedSubtitle}</p>
          <Button
            size="lg"
            className="mt-6 p-2 w-full"
            onClick={() => setPhase("rate")}
          >
            {t.continue}
          </Button>
        </div>
      )}

      {phase === "reported" && (
        <div className="w-full max-w-md rounded-lg border border-border bg-surface1 p-5 text-center sm:p-6">
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

      {!isChatFullBleed && (
        <button
          onClick={() => router.push("/")}
          className="mt-6 text-xs text-muted hover:text-foreground"
        >
          {t.backHome}
        </button>
      )}
    </main>
  );
}
