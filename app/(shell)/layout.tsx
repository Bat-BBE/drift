"use client";

import { AppShell } from "@/components/nav/AppShell";

// A real Next.js layout (not a per-page wrapper) so AppShell — and the
// friends/unread-count fetches it drives — mounts once and persists
// across navigation between Home/Chat/Friends/Settings, instead of being
// torn down and refetched from scratch on every single page change.
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
