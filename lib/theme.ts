"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "drift-theme";

// Module-level store so every component that calls useTheme() reads and
// writes the same value — a plain useState per call site would let two
// mounted instances (e.g. the sidebar's toggle and a page's own content)
// drift out of sync, since setting one never re-renders the other.
let currentTheme: Theme = "dark";
let hydrated = false;
const listeners = new Set<() => void>();

function applyToDocument(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("light", theme === "light");
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  currentTheme = saved === "light" ? "light" : "dark";
  applyToDocument(currentTheme);
}

function setGlobalTheme(next: Theme) {
  hydrate();
  currentTheme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  applyToDocument(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  hydrate();
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    setGlobalTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setGlobalTheme(currentTheme === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, toggleTheme };
}
