"use client";

import { useCallback, useEffect, useState } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "drift-locale";

const dict = {
  mn: {
    onlineConnecting: "Онлайн хэрэглэгчдийн тоог ачааллаж байна...",
    onlineCount: (n: number) => `Одоо ${n} хүн онлайн байна`,

    heroLine1: "Танихгүй хүнтэй",
    heroLine2: "шууд ярилцаарай.",

    heroSubtitle:
      "100% нэрээ нууцалсан. Бүртгүүлэх шаардлагагүй. Зүгээр л шинэ хүнтэй ярилц.",

    startChatting: "Чат эхлүүлэх",

    ageConfirm: "Би 18 ба түүнээс дээш настай.",

    continue: "Үргэлжлүүлэх",

    notDating:
      "Энэ бол болзооны апп биш. Шинэ хүмүүстэй аюулгүй, энгийн байдлаар ярилцах орчин.",

    searching1: "Тохирох хүн хайж байна...",
    searching2: "Түр хүлээнэ үү...",
    searching3: "Холбох хүн хайж байна...",
    searching4: "Бараг боллоо...",

    cancelSearch: "Хайлтыг зогсоох",

    noMatchTitle: "Одоогоор холбогдох хүн алга",
    noMatchSubtitle:
      "Яг одоо онлайн хэрэглэгч байхгүй байна. Түр хүлээгээд дахин оролдоно уу.",

    tryAgain: "Дахин хайх",

    matchFound: "Холбогдох хүн олдлоо!",

    connecting: "Холбож байна...",

    stranger: "Танихгүй хүн",

    typeMessage: "Мессежээ бичнэ үү...",

    send: "Илгээх",

    leave: "Чатаас гарах",

    reportTitle: "Хэрэглэгчийг мэдээлэх",

    reportSubtitle:
      "Мэдээлсний дараа чат шууд дуусна. Нөгөө тал таныг мэдээлснийг мэдэхгүй.",

    reportReasons: [
      "Дарамталсан",
      "Спам эсвэл бот",
      "Зохисгүй бэлгийн агуулга",
      "Насанд хүрээгүй байж болзошгүй",
      "Үзэн ядалт, доромжлол",
      "Бусад",
    ],

    cancel: "Болих",

    disconnectedTitle: "Нөгөө хүн чатаас гарлаа",

    disconnectedSubtitle: "Энэ яриа дууссан.",

    reportedTitle: "Мэдээлэл амжилттай илгээгдлээ",

    reportedSubtitle:
      "Баярлалаа. Таны мэдээллийг хүлээн авлаа. Энэ нь нөгөө хэрэглэгчид харагдахгүй.",

    findNewMatch: "Шинэ хүнтэй холбогдох",

    rateTitle: "Энэ яриа ямар санагдсан бэ?",

    rateSubtitle:
      "Таны үнэлгээ зөвхөн илүү тохирох хүмүүсийг санал болгоход ашиглагдана.",

    good: "Таалагдсан",

    notGreat: "Таалагдаагүй",

    nextMatch: "Дараагийн хүн",

    backHome: "← Нүүр хуудас",
  },

  en: {
    onlineConnecting: "Loading online users...",
    onlineCount: (n: number) => `${n} people online`,

    heroLine1: "Meet someone new,",
    heroLine2: "start talking instantly.",

    heroSubtitle:
      "100% anonymous. No sign-up required. Just genuine conversations.",

    startChatting: "Start chatting",

    ageConfirm: "I confirm that I am 18 years or older.",

    continue: "Continue",

    notDating:
      "This isn't a dating app. It's a place to have safe, anonymous conversations with new people.",

    searching1: "Looking for someone...",
    searching2: "Please wait...",
    searching3: "Finding your chat partner...",
    searching4: "Almost ready...",

    cancelSearch: "Cancel search",

    noMatchTitle: "No one is available right now",

    noMatchSubtitle:
      "There aren't any users online at the moment. Please try again shortly.",

    tryAgain: "Try again",

    matchFound: "Match found!",

    connecting: "Connecting...",

    stranger: "Stranger",

    typeMessage: "Type a message...",

    send: "Send",

    leave: "Leave chat",

    reportTitle: "Report this user",

    reportSubtitle:
      "Reporting will immediately end the chat. They won't know who reported them.",

    reportReasons: [
      "Harassment",
      "Spam or bot",
      "Sexual content",
      "Possible minor",
      "Hate speech",
      "Other",
    ],

    cancel: "Cancel",

    disconnectedTitle: "The stranger left the chat",

    disconnectedSubtitle: "This conversation has ended.",

    reportedTitle: "Report submitted",

    reportedSubtitle:
      "Thank you. Your report has been received and remains anonymous.",

    findNewMatch: "Find another person",

    rateTitle: "How was this conversation?",

    rateSubtitle:
      "Your feedback is only used to improve future matches. It's never shared.",

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
