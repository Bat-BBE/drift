export const FRIEND_REQUEST_MARKER = "__DRIFT_FRIEND_REQUEST__::";

export function encodeFriendRequest(): string {
  return `${FRIEND_REQUEST_MARKER}${Date.now()}`;
}

export function isFriendRequest(text: string): boolean {
  return text.startsWith(FRIEND_REQUEST_MARKER);
}
