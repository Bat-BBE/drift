const AVATARS = [
  { emoji: "🦊", name: "Vнэг", from: "#7c5cff", to: "#4cc9f0" },
  { emoji: "🐼", name: "Панда", from: "#ff5ca8", to: "#7c5cff" },
  { emoji: "🐨", name: "Коала", from: "#4cc9f0", to: "#34d399" },
  { emoji: "🦁", name: "Арслан", from: "#fbbf24", to: "#ff5ca8" },
  { emoji: "🐯", name: "Бар", from: "#34d399", to: "#4cc9f0" },
  { emoji: "🐰", name: "Туулай", from: "#ff5ca8", to: "#fbbf24" },
  { emoji: "🐻", name: "Баавгай", from: "#7c5cff", to: "#ff5ca8" },
  { emoji: "🐵", name: "Сармагчин", from: "#4cc9f0", to: "#7c5cff" },
  { emoji: "🐧", name: "Пингвин", from: "#34d399", to: "#7c5cff" },
  { emoji: "🦉", name: "Шар шувуу", from: "#fbbf24", to: "#34d399" },
  { emoji: "🐺", name: "Чоно", from: "#7c5cff", to: "#34d399" },
  { emoji: "🦄", name: "Ганц эвэрт", from: "#ff5ca8", to: "#4cc9f0" },
  { emoji: "🐱", name: "Муур", from: "#4cc9f0", to: "#ff5ca8" },
  { emoji: "🐶", name: "Нохой", from: "#fbbf24", to: "#7c5cff" },
] as const;

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatar(id: string) {
  return AVATARS[hashString(id) % AVATARS.length];
}
