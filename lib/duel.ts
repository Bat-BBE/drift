export const DUEL_START_MARKER = "__DRIFT_DUEL_START__::";
export const DUEL_MOVE_MARKER = "__DRIFT_DUEL_MOVE__::";

export type DuelMove = "rock" | "paper" | "scissors";
export type DuelResult = "win" | "lose" | "draw";

export const DUEL_MOVES: { id: DuelMove; emoji: string; label: string }[] = [
  { id: "rock", emoji: "🪨", label: "Чулуу" },
  { id: "paper", emoji: "📄", label: "Даавуу" },
  { id: "scissors", emoji: "✂️", label: "Хайч" },
];

const BEATS: Record<DuelMove, DuelMove> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export function resolveDuel(myMove: DuelMove, theirMove: DuelMove): DuelResult {
  if (myMove === theirMove) return "draw";
  return BEATS[myMove] === theirMove ? "win" : "lose";
}

export function encodeDuelStart(roundId: string): string {
  return `${DUEL_START_MARKER}${roundId}`;
}

export function decodeDuelStart(text: string): { roundId: string } | null {
  if (!text.startsWith(DUEL_START_MARKER)) return null;
  return { roundId: text.slice(DUEL_START_MARKER.length) };
}

export function encodeDuelMove(roundId: string, move: DuelMove): string {
  return `${DUEL_MOVE_MARKER}${roundId}:${move}`;
}

export function decodeDuelMove(
  text: string,
): { roundId: string; move: DuelMove } | null {
  if (!text.startsWith(DUEL_MOVE_MARKER)) return null;
  const rest = text.slice(DUEL_MOVE_MARKER.length);
  const sepIndex = rest.lastIndexOf(":");
  if (sepIndex === -1) return null;
  return {
    roundId: rest.slice(0, sepIndex),
    move: rest.slice(sepIndex + 1) as DuelMove,
  };
}

export interface DuelMessageLike {
  from: "me" | "stranger";
  text: string;
  sentAt: number;
}

export interface DuelRoundState {
  roundId: string;
  startedAt: number;
  myMove: DuelMove | null;
  theirMove: DuelMove | null;
}

export function getLatestDuelRound(
  messages: DuelMessageLike[],
): DuelRoundState | null {
  let latestStart: { roundId: string; startedAt: number } | null = null;

  for (const m of messages) {
    const start = decodeDuelStart(m.text);
    if (start) latestStart = { roundId: start.roundId, startedAt: m.sentAt };
  }
  if (!latestStart) return null;

  let myMove: DuelMove | null = null;
  let theirMove: DuelMove | null = null;

  for (const m of messages) {
    const move = decodeDuelMove(m.text);
    if (!move || move.roundId !== latestStart.roundId) continue;
    if (m.from === "me") myMove = move.move;
    else theirMove = move.move;
  }

  return {
    roundId: latestStart.roundId,
    startedAt: latestStart.startedAt,
    myMove,
    theirMove,
  };
}
