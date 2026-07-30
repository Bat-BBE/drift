import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://drift-six-iota.vercel.app/";
const TITLE = "Drift — Talk to someone new, in seconds.";
const DESCRIPTION =
  "Anonymous random chat. No sign-up. No profile. Just a conversation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Drift",
  title: {
    default: TITLE,
    template: "%s · Drift",
  },
  description: DESCRIPTION,
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Drift",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Drift",
    images: ["/icon.svg"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/icon.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7fa" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
