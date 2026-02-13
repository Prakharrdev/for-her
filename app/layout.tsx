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
  title: "Eternal Sakura — For Gauri, by Prakhar | A Love Story in Petals",
  description:
    "Eternal Sakura is an immersive, scroll-driven love letter crafted by Prakhar for Gauri — tracing every glance, every heartbeat, and every memory from September 2022 to forever. Built with sakura petals, animated timelines, and a heart that never stops counting.",
  keywords: [
    "Eternal Sakura",
    "Sakura by Prakhar Dev",
    "Sakura Prakhar",
    "Eternal Sakura Prakhar",
    "Sakura Gauri",
    "Prakhar Dev",
    "Prakhar Gauri",
    "sakura perkkk",
    "sakura.perkkk.dev",
    "perkkk dev",
    "perkkk",
    "Valentine",
    "valentine 2026",
    "valentine gift for girlfriend",
    "valentine website",
    "valentine love letter",
    "creative valentine gift",
    "digital love letter",
    "online love letter",
    "interactive love letter",
    "love story",
    "love story website",
    "romantic website",
    "romantic gift",
    "scroll animation",
    "scroll-driven animation",
    "sakura",
    "sakura petals",
    "cherry blossom love",
    "for her",
    "for girlfriend",
    "valentine gift",
    "love letter website",
    "relationship timeline",
    "memory lane",
    "couple website",
    "anniversary website",
    "long distance love",
    "long distance relationship",
    "eternal love",
    "love counter",
    "relationship counter",
    "how long have we been together",
    "custom valentine website",
    "best valentine gift 2026",
    "unique valentine gift",
    "personalized love story",
    "web developer valentine",
    "coded with love",
    "Prakhar developer",
    "prakharrdev",
  ],
  authors: [{ name: "Prakhar Dev", url: "https://sakura.perkkk.dev" }],
  creator: "Prakhar Dev",
  publisher: "Prakhar Dev",
  metadataBase: new URL("https://sakura.perkkk.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Eternal Sakura — For Gauri, by Prakhar",
    description:
      "An immersive love letter written in sakura petals and light — every scroll reveals a memory, every heartbeat counts the days. From the first glance to forever.",
    siteName: "Eternal Sakura",
    url: "https://sakura.perkkk.dev",
    images: [
      {
        url: "https://sakura.perkkk.dev/genesis/ezgif-frame-100.jpg",
        width: 1200,
        height: 630,
        alt: "Eternal Sakura — A Love Story by Prakhar for Gauri",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Sakura — For Gauri, by Prakhar",
    description:
      "An immersive love letter written in sakura petals and light — every scroll reveals a memory, every heartbeat counts the days.",
    images: ["https://sakura.perkkk.dev/genesis/ezgif-frame-100.jpg"],
    creator: "@prakharrdev",
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
