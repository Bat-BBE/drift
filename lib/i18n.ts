"use client";

import { useCallback, useEffect, useState } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "drift-locale";

const dict = {
  mn: {
    onlineConnecting: "Онлайн хэрэглэгчдийн тоог ачааллаж байна...",
    onlineCount: (n: number) => `Одоо ${n} хүн онлайн байна`,

    heroLine1: "Эмо байна уу?",
    heroLine2: "Нэг бичээд үз.",

    heroSubtitle:
      "100% нэрээ нууцалсан. Бүртгэлгүй. Шинэ хүнтэй чөлөөтэй ярилц.",

    startChatting: "Чат эхлүүлэх",

    ageConfirm: "Би 18 ба түүнээс дээш настай.",

    continue: "Үргэлжлүүлэх",

    safetyTitle: "Аюулгүй байдлын зөвлөмж",

    safetyTips: [
      "Өөрийн овог нэр, утасны дугаар, хаяг зэрэг хувийн мэдээллээ бүү хуваалцаарай.",
      "Хэрэв яриа танд тухгүй санагдвал хүссэн үедээ чатаас гарч болно.",
      "Зохисгүй эсвэл сэжигтэй хэрэглэгчийг мэдээлээрэй.",
      "Бусдыг хүндэтгэж, соёлтой харилцаарай.",
    ],

    seen: "харсан",
    icebreaker: "Санамсаргvй асуулт",

    notDating:
      "Энэ бол болзооны апп биш. Шинэ хүмүүстэй аюулгүй, энгийн байдлаар харилцах орчин.",

    matchesToday: (n: number) => `Өнөөдөр ${n} хос vvссэн`,
    howItWorksTitle: "Яаж ажилладаг вэ?",
    step1Title: "Дар",
    step1Desc: "Товч дараад л болоо — бvртгvvлэх шаардлагагvй.",
    step2Title: "Хvлээ",
    step2Desc: "Хэдхэн секундын дотор тохирох хvн олдоно.",
    step3Title: "Ярилц",
    step3Desc: "Чөлөөтэй ярилц, таалагдвал найз бол.",

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

    heroLine1: "New chat.",
    heroLine2: "New conversation.",

    heroSubtitle:
      "100% anonymous. No sign-up required. Start a conversation with someone new.",

    startChatting: "Start chatting",

    ageConfirm: "I confirm that I am 18 years or older.",

    continue: "Continue",

    safetyTitle: "Stay safe",

    safetyTips: [
      "Never share personal information like your phone number, address, or passwords.",
      "Leave the chat anytime if you feel uncomfortable.",
      "Report users who behave inappropriately or make you feel unsafe.",
      "Be respectful and help keep the community welcoming.",
    ],

    seen: "seen",
    icebreaker: "Random question",

    notDating:
      "This isn't a dating app. It's a place to have safe, anonymous conversations with new people.",

    matchesToday: (n: number) => `${n} matches made today`,
    howItWorksTitle: "How it works",
    step1Title: "Tap",
    step1Desc: "One button — no sign-up needed.",
    step2Title: "Wait",
    step2Desc: "A match shows up within seconds.",
    step3Title: "Talk",
    step3Desc: "Chat freely — hit it off? Add them as a friend.",

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
