"use client";

import { useCallback, useEffect, useState } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "drift-locale";

const dict = {
  mn: {
    onlineConnecting: "Онлайн хэрэглэгчдийн тоог ачааллаж байна...",
    onlineCount: (n: number) => `Одоогоор ${n} хүн онлайн байна`,

    heroLine1: "Эмо байна уу?",
    heroLine2: "Нэг бичээд үзэх үү?",

    heroSubtitle:
      "100% нэрээ нууцалсан. Бүртгэл шаардлагагүй. Шинэ хүнтэй чөлөөтэй ярилцаарай.",

    startChatting: "Чат эхлүүлэх",

    ageConfirm: "Би 18 ба түүнээс дээш настай.",

    continue: "Үргэлжлүүлэх",

    shareLabel: "Найз руугаа хуваалцах",
    shareCopied: "Холбоос хуулагдлаа!",

    safetyTitle: "Аюулгүй байдлын зөвлөмж",

    safetyTips: [
      "Өөрийн нэр, утасны дугаар, хаяг зэрэг хувийн мэдээллээ бүү хуваалцаарай.",
      "Хэрэв яриа танд тухгүй санагдвал хүссэн үедээ чатаас гарч болно.",
      "Зохисгүй эсвэл сэжигтэй хэрэглэгчийг мэдээлээрэй.",
      "Бусдыг хүндэтгэн, соёлтой харилцаарай.",
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
      "Энэ бол болзооны апп биш. Харин шинэ хүмүүстэй аюулгүй, нэрээ нууцлан ярилцах орчин юм.",

    matchesToday: (n: number) => `Өнөөдөр ${n} хүн хоорондоо холбогдсон`,

    howItWorksTitle: "Хэрхэн ажилладаг вэ?",

    step1Title: "Дар",

    step1Desc: "Товчийг дарахад л хангалттай. Бүртгүүлэх шаардлагагүй.",

    step2Title: "Хүлээ",

    step2Desc: "Хэдхэн секундын дараа танд тохирох хүн олдоно.",

    step3Title: "Ярилц",

    step3Desc: "Чөлөөтэй ярилц. Хэрэв таалагдвал найзууд болоорой.",

    searching1: "Тохирох хүн хайж байна...",

    searching2: "Түр хүлээнэ үү...",

    searching3: "Холбогдох хүн хайж байна...",

    searching4: "Бараг боллоо...",

    cancelSearch: "Хайлт зогсоох",

    noMatchTitle: "Одоогоор холбогдох хүн алга",

    noMatchSubtitle:
      "Яг одоогоор онлайн хэрэглэгч байхгүй байна. Түр хүлээгээд дахин оролдоно уу.",

    tryAgain: "Дахин оролдох",

    matchFound: "Холбогдох хүн олдлоо!",

    connecting: "Холбож байна...",

    stranger: "Танихгүй хүн",

    typeMessage: "Мессежээ бичнэ үү...",

    send: "Илгээх",

    leave: "Чатаас гарах",

    reportTitle: "Хэрэглэгчийг мэдээлэх",

    reportSubtitle:
      "Мэдээлсний дараа чат шууд дуусна. Нөгөө хэрэглэгч таныг мэдээлсэн гэдгийг мэдэхгүй.",

    reportReasons: [
      "Дарамталсан",
      "Спам эсвэл бот",
      "Зохисгүй бэлгийн агуулга",
      "Насанд хүрээгүй байж болзошгүй",
      "Үзэн ядалт, доромжлол",
      "Бусад",
    ],

    cancel: "Болих",

    disconnectedTitle: "Нөгөө хэрэглэгч чатаас гарлаа",

    disconnectedSubtitle: "Энэ яриа дууслаа.",

    reportedTitle: "Мэдээлэл амжилттай илгээгдлээ",

    reportedSubtitle:
      "Баярлалаа. Таны мэдээллийг хүлээн авлаа. Энэ мэдээлэл нөгөө хэрэглэгчид харагдахгүй.",

    findNewMatch: "Шинэ хүнтэй холбогдох",

    rateTitle: "Энэ яриа танд ямар санагдсан бэ?",

    rateSubtitle:
      "Таны үнэлгээг зөвхөн дараагийн удаа илүү тохирох хүн санал болгоход ашиглана.",

    good: "Таалагдсан",

    notGreat: "Таалагдаагүй",

    nextMatch: "Дараагийн хүн",

    backHome: "← Нүүр хуудас",
  },

  en: {
    onlineConnecting: "Loading online users...",
    onlineCount: (n: number) => `${n} people online`,

    heroLine1: "Feeling emo?",
    heroLine2: "Why not send a message?",

    heroSubtitle:
      "100% anonymous. No sign-up required. Chat freely with someone new.",

    startChatting: "Start chatting",

    ageConfirm: "I am 18 years old or older.",

    continue: "Continue",

    shareLabel: "Share with a friend",
    shareCopied: "Link copied!",

    safetyTitle: "Safety tips",

    safetyTips: [
      "Never share personal information such as your name, phone number, or address.",
      "If you ever feel uncomfortable, you can leave the chat at any time.",
      "Report users who behave inappropriately or seem suspicious.",
      "Be respectful and treat others with kindness.",
    ],

    seen: "seen",

    icebreaker: "Random question",

    zodiacButton: "Match by zodiac",

    zodiacTitle: "What's your zodiac sign?",

    zodiacPicked: "Selected zodiac:",
    friendRequestButton: "Add friend",
    friendRequestPill: "wants to be friends",
    friendAddedBanner: "🎉 You're friends now!",
    friendsTitle: "Friends",
    friendsEmpty: "No friends yet. Both tap 🤝 in a chat to add each other.",
    friendSince: "Friends since",

    notDating:
      "This isn't a dating app. It's a safe place to have anonymous conversations with new people.",

    matchesToday: (n: number) => `${n} people connected today`,

    howItWorksTitle: "How does it work?",

    step1Title: "Tap",

    step1Desc: "Just tap the button. No sign-up required.",

    step2Title: "Wait",

    step2Desc: "You'll be matched with someone in just a few seconds.",

    step3Title: "Chat",

    step3Desc: "Talk freely. If you get along, become friends.",

    searching1: "Looking for someone to chat with...",

    searching2: "Please wait...",

    searching3: "Finding your chat partner...",

    searching4: "Almost there...",

    cancelSearch: "Cancel search",

    noMatchTitle: "No one is available right now",

    noMatchSubtitle:
      "There are no users online at the moment. Please wait a bit and try again.",

    tryAgain: "Try again",

    matchFound: "Someone's ready to chat!",

    connecting: "Connecting...",

    stranger: "Stranger",

    typeMessage: "Type your message...",

    send: "Send",

    leave: "Leave chat",

    reportTitle: "Report this user",

    reportSubtitle:
      "Reporting will immediately end the chat. The other user won't know that you reported them.",

    reportReasons: [
      "Harassment",
      "Spam or bot",
      "Sexual content",
      "Possible minor",
      "Hate speech or abusive language",
      "Other",
    ],

    cancel: "Cancel",

    disconnectedTitle: "The other user left the chat",

    disconnectedSubtitle: "This conversation has ended.",

    reportedTitle: "Report submitted",

    reportedSubtitle:
      "Thank you. We've received your report. It will remain anonymous.",

    findNewMatch: "Find someone new",

    rateTitle: "How was this conversation?",

    rateSubtitle: "Your feedback is only used to improve future matches.",

    good: "Good",

    notGreat: "Not great",

    nextMatch: "Next person",

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
