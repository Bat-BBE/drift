const AVATARS = [
  { emoji: "🦊", name: "NPC", from: "#7c5cff", to: "#4cc9f0" },
  { emoji: "🐼", name: "AFK", from: "#ff5ca8", to: "#7c5cff" },
  { emoji: "🐨", name: "Noob", from: "#4cc9f0", to: "#34d399" },
  { emoji: "🦁", name: "Pro", from: "#fbbf24", to: "#ff5ca8" },
  { emoji: "🐯", name: "Sigma", from: "#34d399", to: "#4cc9f0" },
  { emoji: "🐰", name: "Aura", from: "#ff5ca8", to: "#fbbf24" },
  { emoji: "🐻", name: "GOAT", from: "#7c5cff", to: "#ff5ca8" },
  { emoji: "🐵", name: "404", from: "#4cc9f0", to: "#7c5cff" },
  { emoji: "🐧", name: "LowPing", from: "#34d399", to: "#7c5cff" },
  { emoji: "🦉", name: "HighPing", from: "#fbbf24", to: "#34d399" },
  { emoji: "🐺", name: "Sneaky", from: "#7c5cff", to: "#34d399" },
  { emoji: "🦄", name: "Ghost", from: "#ff5ca8", to: "#4cc9f0" },
  { emoji: "🐱", name: "Emo", from: "#4cc9f0", to: "#ff5ca8" },
  { emoji: "🐶", name: "Chilee", from: "#fbbf24", to: "#7c5cff" },
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
