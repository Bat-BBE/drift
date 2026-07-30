import { useEffect, useMemo, useRef, useState } from "react";

const STREAK_WINDOW_MS = 60_000;
export const STREAK_MILESTONES = [5, 10, 20, 35, 50];

export interface StreakMessageLike {
  from: "me" | "stranger";
  sentAt: number;
  text: string;
}

function isHiddenSystemMessage(text: string): boolean {
  return text.startsWith("\u0000") || text.startsWith("__ZODIAC__");
}

export function computeStreak(messages: StreakMessageLike[]): number {
  const visible = messages.filter((m) => !isHiddenSystemMessage(m.text));
  let streak = 0;
  let lastFrom: "me" | "stranger" | null = null;
  let lastAt = 0;

  for (const m of visible) {
    if (lastFrom === null) {
      streak = 1;
    } else if (m.from !== lastFrom && m.sentAt - lastAt <= STREAK_WINDOW_MS) {
      streak += 1;
    } else if (m.from !== lastFrom) {
      streak = 1;
    }
    lastFrom = m.from;
    lastAt = m.sentAt;
  }
  return streak;
}

export function useStreak(messages: StreakMessageLike[]) {
  const streak = useMemo(() => computeStreak(messages), [messages]);
  const [milestone, setMilestone] = useState<number | null>(null);
  const seenMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    const hit = STREAK_MILESTONES.find(
      (n) => streak === n && !seenMilestones.current.has(n),
    );
    if (hit) {
      seenMilestones.current.add(hit);
      setMilestone(hit);
      const t = setTimeout(() => setMilestone(null), 3200);
      return () => clearTimeout(t);
    }
  }, [streak]);

  return { streak, milestone };
}
