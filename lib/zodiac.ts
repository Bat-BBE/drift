export const ZODIAC_MARKER = "ZODIAC::";

export interface ZodiacProfile {
  emoji: string;
  name: string;
  element: "fire" | "earth" | "air" | "water";
  planet: string;
  quality: "cardinal" | "fixed" | "mutable";
  traits: string[];
  love: string;
  chatStyle: string;
  hobby: string;
  music: string;
  humor: string;
  redFlag: string;
  greenFlag: string;
  nightOwl: boolean;
  morningPerson: boolean;
  datingScore: number;
  friendshipScore: number;
  relationshipScore: number;
}

export const ZODIAC_SIGNS: readonly ZodiacProfile[] = [
  {
    emoji: "♈",
    name: "Хонь",
    element: "fire",
    planet: "Ангараг",
    quality: "cardinal",
    traits: ["Манлайлагч", "Эрч хvчтэй", "Шулуун", "Зоригтой"],
    love: "Шууд, эрч хvчтэй хайрладаг — мэдрэмжээ нуухгvй.",
    chatStyle: "Шулуун, шуурхай хариулдаг, урт орох дуртай.",
    hobby: "Тамир, adventure, шинэ зvйл туршилт",
    music: "Эрчимтэй, хурдан хэмнэлтэй дуу (rock/EDM)",
    humor: "Шууд, түргэн хошигнол",
    redFlag: "Тэвчээргvй, яаравчилдаг",
    greenFlag: "Санаачилгатай, шийдэмгий",
    nightOwl: false,
    morningPerson: true,
    datingScore: 4,
    friendshipScore: 5,
    relationshipScore: 3,
  },
  {
    emoji: "♉",
    name: "Үхэр",
    element: "earth",
    planet: "Сугар",
    quality: "fixed",
    traits: ["Тогтвортой", "Vнэнч", "Тэвчээртэй", "Практик"],
    love: "Тогтвортой, vнэнч хайр — удаан хугацаанд бататгадаг.",
    chatStyle: "Тайван, бодолтой хариулдаг, яарахгvй.",
    hobby: "Хоол хийх, урлаг, байгальтай ойр байх",
    music: "Зөөлөн, мелодитой дуу (R&B/acoustic)",
    humor: "Хуурай, гэхдээ хvнд хvрдэг хошин",
    redFlag: "Тэсвэргvй зөрvvд байдаг",
    greenFlag: "Найдвартай, тэвчээртэй",
    nightOwl: false,
    morningPerson: true,
    datingScore: 5,
    friendshipScore: 4,
    relationshipScore: 5,
  },
  {
    emoji: "♊",
    name: "Ихэр",
    element: "air",
    planet: "Буд",
    quality: "mutable",
    traits: ["Нээлттэй", "Яриасаг", "Сониуч", "Уян хатан"],
    love: "Сониуч, олон талт хайр — уйтгартай байхыг тэвчихгvй.",
    chatStyle: "Маш их ярьдаг, сэдэв солиход хурдан.",
    hobby: "Ном унших, подкаст, шинэ хvмvvстэй танилцах",
    music: "Олон төрлийн — playlist нь eclectic",
    humor: "Ухаалаг, ёгт хошигнол",
    redFlag: "Тогтворгvй, амлалт барихад хvндрэлтэй",
    greenFlag: "Дасан зохицдог, олон талт",
    nightOwl: true,
    morningPerson: false,
    datingScore: 3,
    friendshipScore: 5,
    relationshipScore: 3,
  },
  {
    emoji: "♋",
    name: "Мэлхий",
    element: "water",
    planet: "Сар",
    quality: "cardinal",
    traits: ["Халамжтай", "Мэдрэмтгий", "Гэр бvлч", "Зөн совинтой"],
    love: "Гvнзгий, халамжтай хайр — маш мэдрэмжтэй.",
    chatStyle: "Сэтгэл хөдлөлөө шууд илэрхийлдэг, гvнзгий яриа таалагддаг.",
    hobby: "Гэр бvлтэйгээ цаг өнгөрvvлэх, кино vзэх",
    music: "Сэтгэл хөдөлгөм дуу (ballad)",
    humor: "Дотно, өөрийгөө элэглэдэг",
    redFlag: "Хэт мэдрэмтгий, гомдоход хялбар",
    greenFlag: "Халамжтай, найдвартай",
    nightOwl: true,
    morningPerson: false,
    datingScore: 4,
    friendshipScore: 4,
    relationshipScore: 5,
  },
  {
    emoji: "♌",
    name: "Арслан",
    element: "fire",
    planet: "Нар",
    quality: "fixed",
    traits: ["Өөртөө итгэлтэй", "Өгөөмөр", "Манлайлагч", "Бvтээлч"],
    love: "Өгөөмөр, драмтай хайр — анхаарлын төвд байх дуртай.",
    chatStyle: "Итгэлтэй, тод илэрхийлдэг.",
    hobby: "Тайзан дээр гарах, урлаг, фото авах",
    music: "Pop/anthem — дуулах дуртай",
    humor: "Өөртөө итгэлтэй хошигнол",
    redFlag: "Магтаал их шаарддаг",
    greenFlag: "Өгөөмөр, урам зоригтой",
    nightOwl: true,
    morningPerson: true,
    datingScore: 5,
    friendshipScore: 4,
    relationshipScore: 4,
  },
  {
    emoji: "♍",
    name: "Охин",
    element: "earth",
    planet: "Буд",
    quality: "mutable",
    traits: ["Нямбай", "Хариуцлагатай", "Логиктой", "Даруу"],
    love: "Нямбай, practical хайр — жижиг зvйлд анхаардаг.",
    chatStyle: "Тодорхой, логиктой ярьдаг.",
    hobby: "Төлөвлөлт, эрvvл мэнд, унших",
    music: "Indie/acoustic, нарийн эгшигтэй",
    humor: "Далд, ухаалаг хошигнол",
    redFlag: "Хэт шvvмжлэлтэй",
    greenFlag: "Хариуцлагатай, тусархаг",
    nightOwl: false,
    morningPerson: true,
    datingScore: 3,
    friendshipScore: 5,
    relationshipScore: 4,
  },
  {
    emoji: "♎",
    name: "Жинлvvр",
    element: "air",
    planet: "Сугар",
    quality: "cardinal",
    traits: ["Тэнцвэртэй", "Эелдэг", "Нийгэмч", "Шударга"],
    love: "Романтик, тэнцвэртэй хайр — зохицолыг эрхэмлэдэг.",
    chatStyle: "Эелдэг, дипломат ярьдаг.",
    hobby: "Урлаг, загвар, нийгэмших",
    music: "Зөөлөн pop, романтик",
    humor: "Хөнгөн, найрсаг хошигнол",
    redFlag: "Шийдэмгий бус, зөрчил зайлсхийдэг",
    greenFlag: "Шударга, нийгэмч",
    nightOwl: true,
    morningPerson: false,
    datingScore: 5,
    friendshipScore: 5,
    relationshipScore: 4,
  },
  {
    emoji: "♏",
    name: "Хилэнц",
    element: "water",
    planet: "Плутон",
    quality: "fixed",
    traits: ["Гvнзгий", "Нууцлаг", "Хvчтэй", "Vнэнч"],
    love: "Эрчимтэй, гvнзгий хайр — бvгдийг эсвэл юуг ч vгvй.",
    chatStyle: "Шууд, гэхдээ нууцлаг зэрэг.",
    hobby: "Нууц зvйл судлах, гvнзгий яриа",
    music: "Хар дуу, эрчимтэй (alt/dark pop)",
    humor: "Хар хошин",
    redFlag: "Атаархалтай, нууцлаг хэт их",
    greenFlag: "Vнэнч, хvчтэй",
    nightOwl: true,
    morningPerson: false,
    datingScore: 5,
    friendshipScore: 3,
    relationshipScore: 5,
  },
  {
    emoji: "♐",
    name: "Нум",
    element: "fire",
    planet: "Бархасбадь",
    quality: "mutable",
    traits: ["Адал явдалч", "Өөдрөг", "Чөлөөтэй", "Шударга"],
    love: "Чөлөөт, adventure хайр — амлалтаас зугтдаг.",
    chatStyle: "Шууд, зугаатай ярьдаг.",
    hobby: "Аялал, шинэ соёл судлах",
    music: "World music, festival vibe",
    humor: "Задгай, egoт хошигнол",
    redFlag: "Амлалт барихад хvндрэлтэй",
    greenFlag: "Өөдрөг, шударга",
    nightOwl: false,
    morningPerson: true,
    datingScore: 3,
    friendshipScore: 5,
    relationshipScore: 2,
  },
  {
    emoji: "♑",
    name: "Матар",
    element: "earth",
    planet: "Санчир",
    quality: "cardinal",
    traits: ["Хариуцлагатай", "Тэвчээртэй", "Зорилготой", "Сахилга баттай"],
    love: "Ноцтой, урт хугацааны хайр.",
    chatStyle: "Товч, зорилготой ярьдаг.",
    hobby: "Ажил, зорилго тавих, тамир",
    music: "Classic/hip-hop, эмхэтгэсэн",
    humor: "Хуурай, ухаалаг",
    redFlag: "Хэт ажилдаа шvтдэг",
    greenFlag: "Найдвартай, тэвчээртэй",
    nightOwl: false,
    morningPerson: true,
    datingScore: 4,
    friendshipScore: 4,
    relationshipScore: 5,
  },
  {
    emoji: "♒",
    name: "Хумх",
    element: "air",
    planet: "Тэнгэрийн ван",
    quality: "fixed",
    traits: ["Шинийг санаачлагч", "Бие даасан", "Өвөрмөц", "Нээлттэй"],
    love: "Өвөрмөц, найз шиг хайр.",
    chatStyle: "Сонирхолтой сэдвvvдээр ярих дуртай.",
    hobby: "Технологи, нийгмийн шинэчлэл",
    music: "Electronic/experimental",
    humor: "Хачирхалтай, ухаалаг хошигнол",
    redFlag: "Сэтгэл хөдлөлөө нуудаг",
    greenFlag: "Шинийг санаачлагч, нээлттэй",
    nightOwl: true,
    morningPerson: false,
    datingScore: 3,
    friendshipScore: 5,
    relationshipScore: 3,
  },
  {
    emoji: "♓",
    name: "Загас",
    element: "water",
    planet: "Далай ван",
    quality: "mutable",
    traits: ["Мэдрэмжтэй", "Уран сэтгэмжтэй", "Энэрэнгvй", "Романтик"],
    love: "Романтик, мөрөөдөмтгий хайр.",
    chatStyle: "Мэдрэмжтэй, уран сэтгэмжтэй ярьдаг.",
    hobby: "Урлаг, хөгжим, зохион бvтээх",
    music: "Dreamy/lofi",
    humor: "Зөөлөн, өрөвдмөөр хошигнол",
    redFlag: "Бодит байдлаас зугтдаг",
    greenFlag: "Энэрэнгvй, уран сэтгэмжтэй",
    nightOwl: true,
    morningPerson: false,
    datingScore: 4,
    friendshipScore: 4,
    relationshipScore: 4,
  },
] as const;

export type ZodiacName = string;

export function findZodiac(name: string): ZodiacProfile | undefined {
  return ZODIAC_SIGNS.find((z) => z.name === name);
}

export interface Compatibility {
  score: number;
  title: string;
  message: string;
}

const COMPATIBILITY: Record<string, Compatibility> = {
  "air-air": {
    score: 4,
    title: "Оюуны гайхалтай холбоо",
    message:
      "Хоёулаа харилцаанд нээлттэй, олон сэдвээр ярилцах дуртай. Яриа бараг тасрахгvй.",
  },
  "air-fire": {
    score: 5,
    title: "Хамгийн хvчтэй хослолуудын нэг",
    message:
      "Салхи галыг улам дvрэлзvvлдэгтэй адил энэ хоёр бие биенийгээ хөгжvvлж, vргэлж шинэ зvйл туршиж байдаг.",
  },
  "air-earth": {
    score: 3,
    title: "Ялгаатай ч боломжтой",
    message:
      "Нэг нь мөрөөдөгч, нөгөө нь бодитой. Харилцан ойлголцвол маш тогтвортой болдог.",
  },
  "air-water": {
    score: 2,
    title: "Хэцvv ойлголцол",
    message:
      "Нэг нь логик, нөгөө нь мэдрэмж давамгай тул ярилцаж сурах шаардлагатай.",
  },
  "earth-earth": {
    score: 4,
    title: "Тогтвортой холбоо",
    message:
      "Итгэлцэл, тууштай байдал өндөр. Харилцаа удаан vргэлжлэх магадлалтай.",
  },
  "earth-fire": {
    score: 3,
    title: "Эсрэг зан чанар",
    message: "Гал эрч хvч авчирдаг бол газар тогтвортой байдлыг бий болгодог.",
  },
  "earth-water": {
    score: 5,
    title: "Байгалийн төгс хослол",
    message:
      "Ус газрыг тэтгэдэгтэй адил нэг нэгнээ дэмжиж, аюулгvй мэдрэмж төрvvлдэг.",
  },
  "fire-fire": {
    score: 4,
    title: "Эрч хvч дvvрэн",
    message:
      "Хоёулаа идэвхтэй, зоригтой. Харин өрсөлдөөнөөс зайлсхийвэл маш сайхан харилцаатай.",
  },
  "fire-water": {
    score: 2,
    title: "Эсрэг ертөнцvvд",
    message:
      "Нэг нь шууд, нөгөө нь мэдрэмжээр ханддаг тул ойлголцохын тулд илvv их хvчин чармайлт шаардлагатай.",
  },
  "water-water": {
    score: 4,
    title: "Сэтгэл хөдлөлийн хvчтэй холбоо",
    message:
      "Мэдрэмжээ сайн ойлгодог. Гэхдээ хэт эмзэг байдал нь асуудал vvсгэж болох юм.",
  },
};

export function getCompatibility(
  nameA: string,
  nameB: string,
): Compatibility | null {
  const a = findZodiac(nameA);
  const b = findZodiac(nameB);
  if (!a || !b) return null;
  const key = [a.element, b.element].sort().join("-");
  return COMPATIBILITY[key] ?? null;
}
