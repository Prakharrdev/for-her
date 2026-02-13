import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eternal Sakura — A Love Story Written in Petals",
  description:
    "An immersive, scroll-driven love letter — from the first glance to forever. Built with sakura petals, memories, and a heartbeat that never stops.",
  keywords: [
    "Eternal Sakura",
    "Valentine",
    "love story",
    "interactive love letter",
    "scroll animation",
    "sakura",
    "romantic website",
  ],
  authors: [{ name: "Prakhar" }],
  creator: "Prakhar",
  metadataBase: new URL("https://eternal-sakura.vercel.app"),
  openGraph: {
    title: "Eternal Sakura — A Love Story Written in Petals",
    description:
      "An immersive, scroll-driven love letter — from the first glance to forever.",
    siteName: "Eternal Sakura",
    images: [
      {
        url: "/genesis/ezgif-frame-100.jpg",
        width: 1200,
        height: 630,
        alt: "Eternal Sakura — A Love Story",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Sakura — A Love Story Written in Petals",
    description:
      "An immersive, scroll-driven love letter — from the first glance to forever.",
    images: ["/genesis/ezgif-frame-100.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eternal Sakura",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ cursor: 'none' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
        style={{ cursor: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
