import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://drift-six-iota.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Drift — Talk to someone new, in seconds.",
  description:
    "Anonymous random chat. No sign-up. No profile. Just a conversation.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Drift — Talk to someone new, in seconds.",
    description:
      "Anonymous random chat. No sign-up. No profile. Just a conversation.",
    url: SITE_URL,
    siteName: "Drift",
    images: ["/icon.svg"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Drift — Talk to someone new, in seconds.",
    description:
      "Anonymous random chat. No sign-up. No profile. Just a conversation.",
    images: ["/icon.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
