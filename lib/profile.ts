const STORAGE_KEY = "drift-profile";

export interface LocalProfile {
  nickname: string;
  avatarIndex: number;
}

export function readLocalProfile(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.nickname === "string" &&
      typeof parsed.avatarIndex === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeLocalProfile(profile: LocalProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}
