import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drift — Talk to someone new, in seconds.",
  description: "Anonymous random chat. No sign-up. No profile. Just a conversation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
