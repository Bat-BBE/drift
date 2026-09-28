"use client";

import { useEffect, useState } from "react";

// Tracks the visual viewport on mobile so a full-bleed chat screen can
// resize around an on-screen keyboard instead of being covered by it —
// `100dvh`/`100vh` alone don't reliably shrink when the keyboard opens on
// iOS/Android, so we measure window.visualViewport directly.
export function useKeyboardSafeViewport(active: boolean) {
  const [vv, setVv] = useState<{ height: number | null; top: number }>({
    height: null,
    top: 0,
  });

  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    const viewport = window.visualViewport;
    if (!viewport) return;
    function update() {
      if (window.innerWidth < 640) {
        setVv({ height: viewport!.height, top: viewport!.offsetTop });
      } else {
        setVv({ height: null, top: 0 });
      }
    }
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  return vv;
}
