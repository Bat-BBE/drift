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
    traits: ["Эрч хүчтэй", "Зоригтой", "Манлайлагч", "Шулуухан"],
    love: "Сэтгэлээ илэрхийлэхээс айдаггүй. Харилцаанд идэвхтэй, зоригтой бөгөөд үнэнч байдаг.",
    chatStyle: "Шууд бөгөөд эрч хүчтэй ярилцдаг. Хурдан хариулах дуртай.",
    hobby: "Спорт, аялал, шинэ зүйл туршиж үзэх",
    music: "Рок, EDM болон эрч хүчтэй хэмнэлтэй хөгжим",
    humor: "Шууд, хөгжилтэй хошигнолд дуртай",
    redFlag: "Яаруу шийдвэр гаргах, тэвчээргүй байх",
    greenFlag: "Санаачилгатай, зоригтой, шийдэмгий",
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
    traits: ["Тогтвортой", "Үнэнч", "Тэвчээртэй", "Найдвартай"],
    love: "Хайртай хүндээ тууштай ханддаг. Итгэлцэл, тогтвортой харилцааг эрхэмлэдэг.",
    chatStyle: "Тайван, бодож байж хариулдаг. Яарах дургүй.",
    hobby: "Хоол хийх, урлаг сонирхох, байгальд амрах",
    music: "Зөөлөн, уянгалаг хөгжим",
    humor: "Энгийн мөртлөө хөгжилтэй хошигнолд дуртай",
    redFlag: "Зөрүүд, өөрчлөлтөд амархан дасдаггүй",
    greenFlag: "Найдвартай, халамжтай, тууштай",
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
    traits: ["Сониуч", "Яриасаг", "Нээлттэй", "Уян хатан"],
    love: "Шинэ мэдрэмж, сонирхолтой яриаг эрхэмлэдэг. Уйтгартай харилцаанд дургүй.",
    chatStyle: "Яриа тасралтгүй өрнүүлдэг. Сэдэв солихдоо хурдан.",
    hobby: "Ном унших, подкаст сонсох, шинэ хүмүүстэй танилцах",
    music: "Төрөл бүрийн хөгжим сонсох дуртай",
    humor: "Ухаалаг, ёжтой хошигнол",
    redFlag: "Амархан уйддаг, тогтворгүй санагдаж магадгүй",
    greenFlag: "Нээлттэй, нийтэч, дасан зохицох чадвартай",
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
    traits: ["Халамжтай", "Мэдрэмтгий", "Гэр бүлсэг", "Зөн совинтой"],
    love: "Гүн сэтгэлээсээ хайрладаг. Халамжтай бөгөөд хайртай хүмүүсээ хамгаалахыг хүсдэг.",
    chatStyle: "Сэтгэлээ нуух дургүй. Илэн далангүй, чин сэтгэлээсээ ярилцдаг.",
    hobby: "Гэр бүлийнхэнтэйгээ цаг өнгөрүүлэх, кино үзэх",
    music: "Уянгалаг, сэтгэл хөдөлгөм хөгжим",
    humor: "Дотно, эелдэг хошигнол",
    redFlag: "Хэт эмзэг, амархан гомдох үе бий",
    greenFlag: "Халамжтай, үнэнч, найдвартай",
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
    traits: ["Өөртөө итгэлтэй", "Өгөөмөр", "Манлайлагч", "Бүтээлч"],
    love: "Хайртай хүнээ халамжилж, үргэлж онцгой мэдрэмж төрүүлэхийг хүсдэг.",
    chatStyle: "Өөртөө итгэлтэй, нээлттэй ярилцдаг.",
    hobby: "Урлаг, тайз, гэрэл зураг, бүтээлч ажил",
    music: "Поп болон эрч хүчтэй хөгжим",
    humor: "Өөртөө итгэлтэй, хөгжилтэй хошигнол",
    redFlag: "Анхаарал, үнэлэмж их хүсдэг",
    greenFlag: "Өгөөмөр, урам зориг өгдөг, үнэнч",
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
    love: "Хайртай хүнээ жижиг зүйлсээр халамжилж, үйлдлээрээ хайр илэрхийлдэг.",
    chatStyle: "Тодорхой, логиктой, бодож байж ярьдаг.",
    hobby: "Төлөвлөх, ном унших, эрүүл амьдралын хэв маяг",
    music: "Инди, акустик болон намуухан хөгжим",
    humor: "Даруухан мөртлөө ухаалаг хошигнол",
    redFlag: "Хэт төгс байхыг эрмэлзэж, шүүмжлэлтэй хандах үе бий",
    greenFlag: "Хариуцлагатай, тусархаг, найдвартай",
    nightOwl: false,
    morningPerson: true,
    datingScore: 3,
    friendshipScore: 5,
    relationshipScore: 4,
  },
  {
    emoji: "♎",
    name: "Жинлүүр",
    element: "air",
    planet: "Сугар",
    quality: "cardinal",
    traits: ["Эелдэг", "Шударга", "Нийгэмч", "Тэнцвэртэй"],
    love: "Харилцаанд эв найрамдал, харилцан ойлголцлыг хамгийн чухалд тооцдог. Романтик, халамжтай нэгэн.",
    chatStyle: "Эелдэг, боловсон бөгөөд нөгөө хүнийхээ бодлыг сонсох дуртай.",
    hobby: "Урлаг, загвар, шинэ хүмүүстэй танилцах",
    music: "Поп, романтик болон намуухан хөгжим",
    humor: "Хөнгөн, хөгжилтэй, найрсаг хошигнол",
    redFlag: "Шийдвэр гаргахдаа удаан, зөрчлөөс зайлсхийх хандлагатай",
    greenFlag: "Шударга, нийтэч, ойлгож сонсдог",
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
    traits: ["Гүнзгий", "Нууцлаг", "Хүчтэй", "Үнэнч"],
    love: "Нэг хайрлавал бүх сэтгэлээ зориулдаг. Итгэлцлийг хамгийн эрхэмд үздэг.",
    chatStyle:
      "Цөөн ярьдаг ч утга учиртай ярилцах дуртай. Итгэлтэй хүнтэйгээ маш нээлттэй байдаг.",
    hobby: "Сэтгэл зүй, нууцлаг зүйлс судлах, гүнзгий яриа өрнүүлэх",
    music: "Алтернатив, дарк поп, уянгалаг хөгжим",
    humor: "Ёжтой, өвөрмөц хошин мэдрэмжтэй",
    redFlag: "Хэт хардалттай эсвэл мэдрэмжээ дотроо хадгалах үе бий",
    greenFlag: "Үнэнч, хамгаалж чаддаг, тууштай",
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
    traits: ["Адал явдалд дуртай", "Өөдрөг", "Чөлөөт", "Шударга"],
    love: "Эрх чөлөөг эрхэмлэдэг ч үнэхээр хайртай хүнтэйгээ мартагдашгүй дурсамж бүтээдэг.",
    chatStyle: "Шулуухан, хөгжилтэй, яриаг үргэлж сонирхолтой байлгадаг.",
    hobby: "Аялал, шинэ газар үзэх, өөр соёлтой танилцах",
    music: "Эрч хүчтэй, олон улсын болон фестивалийн уур амьсгалтай хөгжим",
    humor: "Нээлттэй, хөгжилтэй, алиа хошигнол",
    redFlag: "Хэт эрх чөлөөг эрхэмлэж, амлалт өгөхөөс зайлсхийх үе бий",
    greenFlag: "Өөдрөг, шударга, урам зоригтой",
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
    love: "Харилцаанд тууштай, урт хугацааны итгэлцлийг эрхэмлэдэг.",
    chatStyle: "Товч, тодорхой, бодолтой ярилцдаг.",
    hobby: "Өөрийгөө хөгжүүлэх, спорт, ажил болон зорилгоо биелүүлэх",
    music: "Сонгодог, хип хоп болон тайван хөгжим",
    humor: "Даруухан боловч ухаалаг хошигнол",
    redFlag: "Ажилдаа хэт төвлөрч, мэдрэмжээ илэрхийлэх нь бага байх үе бий",
    greenFlag: "Найдвартай, хариуцлагатай, тууштай",
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
    traits: ["Өвөрмөц", "Бие даасан", "Шинийг санаачлагч", "Нээлттэй"],
    love: "Найз шиг ойлголцож чаддаг харилцааг эрхэмлэдэг. Эрх чөлөөгөө хадгалах дуртай.",
    chatStyle:
      "Өвөрмөц сэдвээр ярилцах дуртай. Яриа нь үргэлж сонирхолтой байдаг.",
    hobby: "Технологи, шинжлэх ухаан, шинэ санаа турших",
    music: "Электрон болон туршилтын хэв маягийн хөгжим",
    humor: "Өвөрмөц, ухаалаг хошигнол",
    redFlag: "Мэдрэмжээ ил гаргахдаа бага зэрэг болгоомжтой",
    greenFlag: "Нээлттэй сэтгэлгээтэй, бүтээлч, шинэлэг",
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
    traits: ["Мэдрэмжтэй", "Уран сэтгэмжтэй", "Энэрэнгүй", "Романтик"],
    love: "Хайр дурлалд чин сэтгэлээсээ ханддаг. Романтик бөгөөд халамжтай нэгэн.",
    chatStyle: "Тайван, мэдрэмжтэй, сэтгэлээсээ ярилцдаг.",
    hobby: "Урлаг, хөгжим, зураг зурах, бүтээл туурвих",
    music: "Lo-fi, инди болон тайван уянгалаг хөгжим",
    humor: "Эелдэг, дулаан мэдрэмж төрүүлдэг хошигнол",
    redFlag:
      "Заримдаа бодит байдлаас зугтах эсвэл хэт мөрөөдөмтгий байх үе бий",
    greenFlag: "Энэрэнгүй, ойлгож сонсдог, халамжтай",
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
    title: "Яриа хэзээ ч тасрахгүй",
    message:
      "Та хоёр шинэ санаа, сонирхолтой сэдвээр ярилцах дуртай. Хамтдаа байхад яриа үргэлж өрнөж байдаг.",
  },

  "air-fire": {
    score: 5,
    title: "Эрч хүчтэй төгс зохицол",
    message:
      "Нэг нь шинэ санаа төрүүлж, нөгөө нь түүнийг бодит болгох эрч хүчтэй. Хамтдаа байхдаа бие биедээ үргэлж урам өгдөг.",
  },

  "air-earth": {
    score: 3,
    title: "Ялгаатай ч бие биенээ нөхнө",
    message:
      "Нэг нь мөрөөдөмтгий, нөгөө нь бодитой. Харилцан ойлголцож чадвал маш бат бөх холбоо үүсдэг.",
  },

  "air-water": {
    score: 2,
    title: "Илүү их ойлголцол хэрэгтэй",
    message:
      "Нэг нь логикоор, нөгөө нь мэдрэмжээр ханддаг. Илэн далангүй ярилцаж чадвал харилцаа улам сайжирна.",
  },

  "earth-earth": {
    score: 4,
    title: "Тогтвортой бөгөөд найдвартай",
    message:
      "Та хоёр итгэлцэл, тууштай байдлыг эрхэмлэдэг. Урт хугацааны бат бөх нөхөрлөл, харилцаа үүсгэх магадлал өндөр.",
  },

  "earth-fire": {
    score: 3,
    title: "Эрч хүч ба тогтвортой байдал",
    message:
      "Нэг нь зоригтой алхам хийдэг бол нөгөө нь зөв чиглүүлдэг. Харилцан ойлголцвол гайхалтай баг болж чадна.",
  },

  "earth-water": {
    score: 5,
    title: "Байгалиасаа нийцдэг",
    message:
      "Нэг нь түшиг тулгуур болж, нөгөө нь халамж дулаан уур амьсгал бүрдүүлдэг. Хамтдаа байхдаа тайван, аюулгүй мэдрэмж төрүүлнэ.",
  },

  "fire-fire": {
    score: 4,
    title: "Эрч хүчээр дүүрэн хослол",
    message:
      "Та хоёр зоригтой, идэвхтэй хүмүүс. Бие биенээ дэмжиж чадвал маш хөгжилтэй, эрч хүчтэй харилцаа бий болно.",
  },

  "fire-water": {
    score: 2,
    title: "Өөр өөр хандлагатай",
    message:
      "Нэг нь шууд илэрхийлдэг бол нөгөө нь мэдрэмжээ илүү эрхэмлэдэг. Бие биенээ ойлгохыг хичээвэл сайхан зохицож чадна.",
  },

  "water-water": {
    score: 4,
    title: "Сэтгэлээрээ ойлголцдог",
    message:
      "Та хоёрын мэдрэмж, зөн совин төстэй. Нэгнийхээ сэтгэлийг амархан ойлгодог ч хэт эмзэг үедээ бие биенээ дэмжих хэрэгтэй.",
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
