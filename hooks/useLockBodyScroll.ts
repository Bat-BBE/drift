"use client";

import { useEffect } from "react";

// Pins the body in place while a full-bleed screen (e.g. an open chat) is
// showing, so the page behind it can't scroll or rubber-band on mobile.
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    const originalPosition = document.body.style.position;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      document.body.style.position = originalPosition;
      document.body.style.width = "";
    };
  }, [active]);
}
