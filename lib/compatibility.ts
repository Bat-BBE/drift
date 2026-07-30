export const QUIZ_ANSWER_MARKER = "\u0000QUIZANSWER::";

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  romance: number;
  chill: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "Амралтын өдрөө яаж өнгөрөөх дуртай вэ?",
    options: [
      { id: "a", emoji: "🎬", label: "Гэртээ кино үзнэ", romance: 2, chill: 3 },
      {
        id: "b",
        emoji: "🚶",
        label: "Найзуудтайгаа гадуур зугаална",
        romance: 1,
        chill: 2,
      },
      {
        id: "c",
        emoji: "🧘",
        label: "Ганцаараа тайван амарна",
        romance: 0,
        chill: 3,
      },
      {
        id: "d",
        emoji: "🗺️",
        label: "Шинэ газар очиж адал явдал хайна",
        romance: 3,
        chill: 1,
      },
    ],
  },
  {
    id: "q2",
    text: "Анхны уулзалт ямар байвал их таалагдах вэ?",
    options: [
      {
        id: "a",
        emoji: "☕",
        label: "Кафед чимээгүй, удаан ярилцах",
        romance: 3,
        chill: 1,
      },
      {
        id: "b",
        emoji: "👯",
        label: "Олон найзтайгаа хамт цуглах",
        romance: 0,
        chill: 3,
      },
      {
        id: "c",
        emoji: "🎮",
        label: "Идэвхтэй тоглоом/спорт хамт хийх",
        romance: 2,
        chill: 2,
      },
      {
        id: "d",
        emoji: "💬",
        label: "Онлайнаар удаан чатлаад дараа нь уулзах",
        romance: 1,
        chill: 1,
      },
    ],
  },
  {
    id: "q3",
    text: "Мессеж бичихдээ ямар маягтай вэ?",
    options: [
      {
        id: "a",
        emoji: "📜",
        label: "Урт, дэлгэрэнгүй бичдэг",
        romance: 3,
        chill: 0,
      },
      { id: "b", emoji: "😂", label: "Товч, хошин шог", romance: 1, chill: 3 },
      { id: "c", emoji: "✨", label: "Emoji, GIF ихтэй", romance: 2, chill: 2 },
      {
        id: "d",
        emoji: "🤫",
        label: "Ховор бичдэг ч утга учиртай",
        romance: 0,
        chill: 1,
      },
    ],
  },
  {
    id: "q4",
    text: "Санал зөрөх үед юу хийдэг вэ?",
    options: [
      {
        id: "a",
        emoji: "🗣️",
        label: "Шууд ярьж тохиролцдог",
        romance: 2,
        chill: 1,
      },
      {
        id: "b",
        emoji: "⏳",
        label: "Цаг өгч, дараа нь ярьдаг",
        romance: 1,
        chill: 2,
      },
      {
        id: "c",
        emoji: "😄",
        label: "Хошигнож зөөллөдөг",
        romance: 0,
        chill: 3,
      },
      {
        id: "d",
        emoji: "🫂",
        label: "Гүнзгий ярилцаж ойлголцдог",
        romance: 3,
        chill: 1,
      },
    ],
  },
  {
    id: "q5",
    text: "Харилцаанд хамгийн чухалд юу үздэг вэ?",
    options: [
      {
        id: "a",
        emoji: "🔒",
        label: "Итгэлцэл, ойлголцол",
        romance: 3,
        chill: 1,
      },
      {
        id: "b",
        emoji: "😆",
        label: "Хамт инээж зугаацах",
        romance: 1,
        chill: 3,
      },
      {
        id: "c",
        emoji: "📈",
        label: "Шинэ зүйл сурч хөгжих",
        romance: 2,
        chill: 2,
      },
      {
        id: "d",
        emoji: "🌊",
        label: "Тайван, дарамтгүй харилцаа",
        romance: 0,
        chill: 2,
      },
    ],
  },
];

export interface QuizAnswers {
  [questionId: string]: string;
}

export function encodeQuizAnswers(answers: QuizAnswers): string {
  return `${QUIZ_ANSWER_MARKER}${JSON.stringify(answers)}`;
}

export function decodeQuizAnswers(text: string): QuizAnswers | null {
  if (!text.startsWith(QUIZ_ANSWER_MARKER)) return null;
  try {
    return JSON.parse(text.slice(QUIZ_ANSWER_MARKER.length));
  } catch {
    return null;
  }
}

export interface CompatibilityResult {
  soulmate: number; // 0-100
  friendly: number; // 0-100
  fact: string;
}

function optionById(questionId: string, optionId: string): QuizOption | null {
  const q = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  return q?.options.find((o) => o.id === optionId) ?? null;
}

export function computeCompatibility(
  myAnswers: QuizAnswers,
  theirAnswers: QuizAnswers,
): CompatibilityResult {
  let romanceDiff = 0;
  let chillDiff = 0;
  let maxPerAxis = 0;

  for (const q of QUIZ_QUESTIONS) {
    const mine = optionById(q.id, myAnswers[q.id]);
    const theirs = optionById(q.id, theirAnswers[q.id]);
    if (!mine || !theirs) continue;
    romanceDiff += Math.abs(mine.romance - theirs.romance);
    chillDiff += Math.abs(mine.chill - theirs.chill);
    maxPerAxis += 3;
  }

  const soulmate = maxPerAxis
    ? Math.round((1 - romanceDiff / maxPerAxis) * 100)
    : 0;
  const friendly = maxPerAxis
    ? Math.round((1 - chillDiff / maxPerAxis) * 100)
    : 0;

  let fact: string;
  if (soulmate - friendly > 15) {
    fact =
      "Романтик долгион давамгайлж байна 💘 — та хоёр ижил долгионтой юм шиг байна.";
  } else if (friendly - soulmate > 15) {
    fact = "Сайхан найзын энерги мэдрэгдэж байна 👯 — хамт байхад хөгжилтэй.";
  } else if (soulmate >= 70 && friendly >= 70) {
    fact = "Ховор тохиолддог тэнцвэр — хоёр талдаа сайн нийцдэг хос байна ✨";
  } else {
    fact =
      "Өвөрмөц хослол — ялгаа их ч энэ нь сонирхолтой яриа үүсгэдэг шүү 🌗";
  }

  return {
    soulmate: Math.max(0, Math.min(100, soulmate)),
    friendly: Math.max(0, Math.min(100, friendly)),
    fact,
  };
}
