"use client";

import { useCallback, useEffect, useState } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "drift-locale";

const dict = {
  mn: {
    onlineConnecting: "Онлайн хэрэглэгчдийн мэдээллийг авч байна...",

    onlineCount: (n: number) => `Яг одоо ${n} хүн ярилцахад бэлэн байна`,

    heroLine1: "Шинэ хүнтэй",
    heroLine2: "яриа эхлүүлье",

    heroSubtitle:
      "Нэрээ нууцлан, ямар ч дарамтгүйгээр шинэ хүмүүстэй ярилц. Заримдаа ганцхан яриа таны өдрийг өөрчилж чадна.",

    startChatting: "Чат эхлүүлэх",

    ageConfirm: "Би 18 ба түүнээс дээш настай.",

    continue: "Үргэлжлүүлэх",

    shareLabel: "Найз руугаа хуваалцах",
    shareCopied: "Холбоос хуулагдлаа!",

    beforeContinue: "Үргэлжлүүлэхийн өмнө",

    gateHint: "Хамгаалалт бидний хувьд чухал — доорхыг уншаад зөвшөөрнө үү",

    safetyTitle: "Аюулгүй ярилцах зөвлөмж",

    safetyTips: [
      "Хувийн мэдээллээ (нэр, утас, хаяг гэх мэт) бусдад бүү дамжуулаарай.",
      "Хэрэв яриа танд тухгүй санагдвал хүссэн үедээ шууд гарах боломжтой.",
      "Зохисгүй хэрэглэгчтэй таарвал мэдээлэх товчийг ашиглаарай.",
      "Хүндлэлтэй, эелдэг харилцаа хамгийн сайхан яриаг бий болгодог.",
    ],

    seen: "харсан",

    icebreaker: "Санамсаргүй асуулт",

    zodiacButton: "Ордоороо тааръя",

    zodiacTitle: "Таны орд юу вэ?",

    zodiacPicked: "Сонгосон орд:",
    friendRequestButton: "Найз болох",
    friendRequestPill: "найз болохыг хvслээ",
    friendAddedBanner: "🎉 Та хоёул найз боллоо!",
    friendsTitle: "Найзууд",
    friendsEmpty:
      "Одоохондоо найз алга. Ярилцлагадаа хоёулаа 🤝 дарвал энд гарч ирнэ.",
    friendSince: "Найз болсон",

    notDating:
      "Энэ бол болзооны апп биш. Харин хүмүүсийг чөлөөтэй ярилцуулж, аюулгүй цахим орчинд шинэ харилцаа холбоо үүсгэх платформ юм.",

    matchesToday: (n: number) => `Өнөөдөр ${n} хүн хоорондоо холбогдсон`,

    howItWorksTitle: "Хэрхэн ажилладаг вэ?",

    step1Title: "Эхлүүлэх",

    step1Desc: "Нэг товч дарахад л хангалттай. Бүртгэлгүйгээр шууд эхэлнэ.",

    step2Title: "Холбогдох",

    step2Desc: "Систем танд ярилцах шинэ хүнийг автоматаар олно.",

    step3Title: "Ярилцах",

    step3Desc:
      "Чөлөөтэй ярилц. Та хоёрын яриа нууцлалтай бусдаас тусгаарлагдах болно.",

    interestTitle: "Юу сонирхдог вэ?",
    interestSubtitle: "Сонирхлоо сонгоод тохирох хүнтэй холбогдоорой",
    interestStartAny: "Хайж эхлэх",
    interestStartWithCount: (n: number) => `${n} сонголттой хайх`,

    searching1: "Танд тохирох хүнийг хайж байна...",

    searching2: "Түр хүлээнэ үү...",

    searching3: "Шинэ яриа эхлэх гэж байна...",

    searching4: "Холбож байна...",

    cancelSearch: "Хайлт зогсоох",

    noMatchTitle: "Одоогоор холбогдох хүн алга",

    noMatchSubtitle:
      "Яг одоогоор онлайн хэрэглэгч байхгүй байна. Түр хүлээгээд дахин оролдоно уу.",

    tryAgain: "Дахин оролдох",

    matchFound: "Шинэ хүнтэй холбогдлоо!",

    connecting: "Яриаг эхлүүлж байна...",

    stranger: "Шинэ хүн",

    typeMessage: "Мессежээ бичээрэй...",

    duelButton: "Х~Ч~Д",

    quizButton: "S vs F",

    send: "Илгээх",

    leave: "Яриаг дуусгах",

    reportTitle: "Хэрэглэгчийг мэдээлэх",

    reportSubtitle:
      "Мэдээлсний дараа энэ яриа шууд дуусна. Таны мэдээлэл нууц хэвээр үлдэнэ.",

    reportReasons: [
      "Дарамталсан",
      "Спам эсвэл бот",
      "Зохисгүй бэлгийн агуулга",
      "Насанд хүрээгүй байж болзошгүй",
      "Үзэн ядалт, доромжлол",
      "Бусад",
    ],

    cancel: "Болих",

    disconnectedTitle: "Нөгөө тал яриаг дуусгалаа",

    disconnectedSubtitle: "Та хүсвэл өөр хүнтэй дахин ярилцаж болно.",

    reportedTitle: "Мэдээлэл амжилттай илгээгдлээ",

    reportedSubtitle:
      "Баярлалаа. Таны мэдээллийг хүлээн авлаа. Энэ мэдээлэл нөгөө хэрэглэгчид харагдахгүй.",

    findNewMatch: "Шинэ хүнтэй холбогдох",

    rateTitle: "Энэ яриа танд ямар санагдав?",

    rateSubtitle:
      "Таны үнэлгээ дараагийн удаа илүү тохирох хүнтэй холбох боломжийг сайжруулахад тусална.",

    good: "Таалагдсан",

    notGreat: "Тийм ч биш",

    nextMatch: "Өөр хүнтэй ярилцах",

    backHome: "← Нүүр хуудас",
  },

  en: {
    onlineConnecting: "Checking who's online...",

    onlineCount: (n: number) => `${n} people are ready to chat`,

    heroLine1: "Start a",
    heroLine2: "real conversation",

    heroSubtitle:
      "Meet new people in a safe, anonymous space. No sign-up, no pressure—just genuine conversations.",

    startChatting: "Start chatting",

    ageConfirm: "I am 18 years old or older.",

    continue: "Continue",

    shareLabel: "Share with a friend",
    shareCopied: "Link copied!",

    interestTitle: "What are you into?",
    interestSubtitle:
      "Pick a few interests to get matched with someone who shares them",
    interestStartAny: "Start chatting",
    interestStartWithCount: (n: number) =>
      `Search with ${n} interest${n > 1 ? "s" : ""}`,

    beforeContinue: "Before you continue",

    gateHint:
      "Your safety matters to us. Please read and agree to the guidelines below.",

    safetyTitle: "Stay safe while chatting",

    safetyTips: [
      "Never share personal information such as your name, phone number, or address.",
      "If a conversation makes you uncomfortable, you can leave at any time.",
      "Report anyone who behaves inappropriately or seems suspicious.",
      "Kindness and respect help create better conversations for everyone.",
    ],

    seen: "seen",

    icebreaker: "Random question",

    zodiacButton: "Match by zodiac",

    zodiacTitle: "What's your zodiac sign?",

    zodiacPicked: "Selected zodiac:",

    friendRequestButton: "Become friends",

    friendRequestPill: "wants to be friends",

    friendAddedBanner: "🎉 You're friends now!",

    friendsTitle: "Friends",

    friendsEmpty:
      "You don't have any friends yet. If both of you tap 🤝 during a conversation, they'll appear here.",

    friendSince: "Friends since",

    notDating:
      "This isn't a dating app. It's a safe place where people can meet, have real conversations, and build genuine connections.",

    matchesToday: (n: number) => `${n} people connected today`,

    howItWorksTitle: "How it works",

    step1Title: "Start",

    step1Desc: "Just tap the button. No sign-up or account required.",

    step2Title: "Connect",

    step2Desc:
      "We'll automatically match you with someone who's ready to chat.",

    step3Title: "Talk",

    step3Desc:
      "Enjoy the conversation. Your chat is private and only visible to the two of you.",

    searching1: "Looking for someone to chat with...",

    searching2: "Please wait a moment...",

    searching3: "Getting your conversation ready...",

    searching4: "Connecting you now...",

    cancelSearch: "Cancel search",

    noMatchTitle: "No one is available right now",

    noMatchSubtitle:
      "There aren't any users online at the moment. Please wait a little and try again.",

    tryAgain: "Try again",

    matchFound: "You've been matched!",

    connecting: "Starting your conversation...",

    stranger: "New person",

    typeMessage: "Type your message...",

    send: "Send",
    duelButton: "Х~Ч~Д",

    quizButton: "S vs F",

    leave: "End conversation",

    reportTitle: "Report this user",

    reportSubtitle:
      "Reporting this user will immediately end the conversation. Your report will remain completely anonymous.",

    reportReasons: [
      "Harassment",
      "Spam or bot",
      "Sexual content",
      "Possible minor",
      "Hate speech or abusive language",
      "Other",
    ],

    cancel: "Cancel",

    disconnectedTitle: "The other person left the conversation",

    disconnectedSubtitle:
      "You can always start a new conversation with someone else.",

    reportedTitle: "Report submitted",

    reportedSubtitle:
      "Thank you. We've received your report. The other person will not know that you reported them.",

    findNewMatch: "Find someone new",

    rateTitle: "How was this conversation?",

    rateSubtitle: "Your feedback helps us make future matches even better.",

    good: "Enjoyed it",

    notGreat: "Not really",

    nextMatch: "Start another conversation",

    backHome: "← Back to home",
  },
} as const;

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("mn");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "mn" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "mn" ? "en" : "mn");
  }, [locale, setLocale]);

  return { locale, setLocale, toggleLocale, t: dict[locale] };
}
