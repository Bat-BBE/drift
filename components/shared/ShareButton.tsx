"use client";

import { useState } from "react";

export function ShareButton({
  label,
  copiedLabel,
}: {
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const shareData = {
      title: "Drift",
      text: "Бусадтай секундын дотор бич 👋",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface1/80 px-4 py-2 text-xs text-muted backdrop-blur-xl transition-colors hover:text-foreground"
    >
      {copied ? `✅ ${copiedLabel}` : `🔗 ${label}`}
    </button>
  );
}
