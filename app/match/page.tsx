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
import { StreakBadge } from "@/components/chat/StreakBadge";
import { DuelGame } from "@/components/chat/DuelGame";
import { CompatibilityQuiz } from "@/components/chat/CompatibilityQuiz";
import { useStreak } from "@/hooks/useStreak";
import {
  getLatestDuelRound,
  encodeDuelStart,
  encodeDuelMove,
} from "@/lib/duel";
import {
  decodeQuizAnswers,
  encodeQuizAnswers,
  QUIZ_ANSWER_MARKER,
  type QuizAnswers,
} from "@/lib/compatibility";

type Phase =
  | "selectType"
  | "searching"
  | "matched"
  | "chat"
  | "disconnected"
  | "reported"
  | "rate"
  | "noMatch";

const INTEREST_OPTIONS = [
  { id: "deep", emoji: "🧠", label: "Амьдрал, үзэл бодол" },
  { id: "fun", emoji: "😂", label: "Зүгээр хөгжилтэй ярилцах" },
  { id: "advice", emoji: "📚", label: "Санал зөвлөгөө авах" },
  { id: "gaming", emoji: "🎮", label: "Тоглоомын тухай" },
  { id: "tech", emoji: "💻", label: "IT, AI талаар" },
  { id: "movies", emoji: "🎬", label: "Кино, цуврал" },
  { id: "music", emoji: "🎵", label: "Дуу хөгжим" },
  { id: "art", emoji: "🎨", label: "Урлаг" },
  { id: "travel", emoji: "✈️", label: "Аяллын тухай" },
  { id: "animals", emoji: "🐾", label: "Амьтны талаар" },
] as const;

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

function IconAction({
  icon,
  label,
  onClick,
  tone = "muted",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "muted" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface2 text-[15px] leading-none transition-colors active:scale-95 ${
        tone === "danger"
          ? "text-muted hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
          : "text-muted hover:bg-surface1 hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
}

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface2 px-3 text-xs text-muted transition-colors hover:text-foreground active:scale-95"
    >
      <span aria-hidden className="text-sm leading-none">
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function InterestChip({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all duration-150 active:scale-95 ${
        selected
          ? "border-transparent bg-gradient-to-r from-brand to-brand-pink text-white shadow-[0_4px_18px_rgba(124,92,255,0.35)]"
          : "border-border bg-surface2 text-muted hover:border-brand/50 hover:text-foreground"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </button>
  );
}

function StatusCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface1/90 p-6 text-center backdrop-blur-xl">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
      {children}
    </div>
  );
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

  const [phase, setPhase] = useState<Phase>("selectType");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showZodiacPicker, setShowZodiacPicker] = useState(false);
  const [showZodiacCard, setShowZodiacCard] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const friendAddedRef = useRef(false);
  const [showDuel, setShowDuel] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { streak, milestone } = useStreak(messages);
  const duelRound = getLatestDuelRound(messages);

  const myQuizAnswers = messages.find(
    (m) => m.from === "me" && m.text.startsWith(QUIZ_ANSWER_MARKER),
  );
  const theirQuizAnswers = messages.find(
    (m) => m.from === "stranger" && m.text.startsWith(QUIZ_ANSWER_MARKER),
  );

  const selectedInterestTags = INTEREST_OPTIONS.filter((o) =>
    selectedInterests.includes(o.id),
  ).map((o) => `${o.emoji} ${o.label}`);

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
    if (!friendAddedRef.current && userId && session) {
      friendAddedRef.current = true;
    }
  }, [userId, session]);

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
    friendAddedRef.current = false;
    setPhase("searching");
    startSearch(selectedInterestTags);
    hasStarted.current = true;
  }

  function toggleInterest(id: string) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function handleStartSearch() {
    hasStarted.current = true;
    startSearch(selectedInterestTags);
    setPhase("searching");
  }

  function handleStartDuel() {
    sendMessage(encodeDuelStart(crypto.randomUUID()));
    setShowDuel(true);
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

      {phase === "selectType" && (
        <div className="w-full max-w-md animate-quiz-fade-in rounded-2xl border border-border bg-surface1/90 p-6 text-center backdrop-blur-xl">
          <span className="text-3xl">🎯</span>
          <h2 className="mt-2 font-display text-lg font-semibold">
            {t.interestTitle}
          </h2>
          <p className="mt-1 text-sm text-muted">{t.interestSubtitle}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {INTEREST_OPTIONS.map((opt) => (
              <InterestChip
                key={opt.id}
                emoji={opt.emoji}
                label={opt.label}
                selected={selectedInterests.includes(opt.id)}
                onClick={() => toggleInterest(opt.id)}
              />
            ))}
          </div>

          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-brand to-brand-pink p-2"
            onClick={handleStartSearch}
          >
            {selectedInterests.length > 0
              ? t.interestStartWithCount(selectedInterests.length)
              : t.interestStartAny}
          </Button>
        </div>
      )}

      {phase === "searching" && (
        <div className="flex flex-col items-center px-4">
          <SearchingAnimation messages={searchingMessages} />
          <button
            onClick={handleCancelSearch}
            className="-mt-4 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
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
        <StatusCard title={t.noMatchTitle} subtitle={t.noMatchSubtitle}>
          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-brand to-brand-pink p-2"
            onClick={handleNextMatch}
          >
            {t.tryAgain}
          </Button>
        </StatusCard>
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
          {/* Header — exactly two flex groups (identity | actions), each
              with its own gap, so nothing can ever collide regardless of
              how narrow the screen is. Identity truncates first. */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
              <span className="relative shrink-0">
                <Avatar id={session.partnerId} size={36} minSize={30} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface1 bg-success" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight">
                  {getAvatar(session.partnerId).name}
                </p>
                {streak > 0 && (
                  <StreakBadge streak={streak} milestone={milestone} />
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <IconAction
                icon="⚑"
                label={t.reportTitle}
                tone="danger"
                onClick={() => setShowReport(true)}
              />
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

          {/* Quick actions — every icon-based control lives in this one
              scrollable row now (games, extras, and reactions), styled
              identically, instead of being split between the header and
              here. Edge fades hint that it scrolls. */}
          <div className="relative border-t border-border">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-surface1 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-surface1 to-transparent" />
            <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 [&::-webkit-scrollbar]:hidden">
              <ActionChip
                icon="🔮"
                label={t.zodiacButton}
                onClick={() => setShowZodiacPicker(true)}
              />
              <ActionChip
                icon="⚔️"
                label={t.duelButton}
                onClick={handleStartDuel}
              />
              <ActionChip
                icon="💫"
                label={t.quizButton}
                onClick={() => setShowQuiz(true)}
              />
              <ActionChip
                icon="🎲"
                label={t.icebreaker}
                onClick={() => sendMessage(randomIcebreaker())}
              />
              <span
                className="mx-0.5 h-5 w-px shrink-0 bg-border"
                aria-hidden
              />
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendMessage(emoji)}
                  aria-label={emoji}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-fast hover:scale-125 hover:bg-surface2 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
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

      {phase === "chat" && showDuel && duelRound && (
        <DuelGame
          round={duelRound}
          onPickMove={(move) =>
            sendMessage(encodeDuelMove(duelRound.roundId, move))
          }
          onClose={() => setShowDuel(false)}
          onRematch={() => sendMessage(encodeDuelStart(crypto.randomUUID()))}
        />
      )}

      {phase === "chat" && showQuiz && (
        <CompatibilityQuiz
          myAnswers={
            myQuizAnswers ? decodeQuizAnswers(myQuizAnswers.text) : null
          }
          theirAnswers={
            theirQuizAnswers ? decodeQuizAnswers(theirQuizAnswers.text) : null
          }
          onAnswer={(answers) => sendMessage(encodeQuizAnswers(answers))}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {phase === "disconnected" && (
        <StatusCard
          title={t.disconnectedTitle}
          subtitle={t.disconnectedSubtitle}
        >
          <Button
            size="lg"
            className="mt-6 w-full p-2"
            onClick={() => setPhase("rate")}
          >
            {t.continue}
          </Button>
        </StatusCard>
      )}

      {phase === "reported" && (
        <StatusCard title={t.reportedTitle} subtitle={t.reportedSubtitle}>
          <Button size="lg" className="mt-6 w-full" onClick={handleNextMatch}>
            {t.findNewMatch}
          </Button>
        </StatusCard>
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
          className="mt-6 rounded-full px-4 py-2 text-xs text-muted transition-colors hover:text-foreground"
        >
          {t.backHome}
        </button>
      )}
    </main>
  );
}
