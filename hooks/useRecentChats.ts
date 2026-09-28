"use client";

import { useCallback, useEffect, useState } from "react";

// Purely a local, on-device memory of who you recently talked to — no
// message content, no server round-trip. It exists only in this browser's
// localStorage so the dashboard can show a friendly "recent chats" glance
// without the app ever storing what was actually said.
const STORAGE_KEY = "drift-recent-chats";
const MAX_ENTRIES = 8;

export interface RecentChatEntry {
  partnerId: string;
  endedAt: number;
}

function readStore(): RecentChatEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useRecentChats() {
  const [entries, setEntries] = useState<RecentChatEntry[]>([]);

  useEffect(() => {
    setEntries(readStore());
  }, []);

  const addRecentChat = useCallback((partnerId: string) => {
    setEntries((prev) => {
      const next = [
        { partnerId, endedAt: Date.now() },
        ...prev.filter((e) => e.partnerId !== partnerId),
      ].slice(0, MAX_ENTRIES);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearRecentChats = useCallback(() => {
    setEntries([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { entries, addRecentChat, clearRecentChats };
}
