import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  title: "Eternal Sakura – An Interactive Digital Love Letter by Prakhar Dev",
  description:
    "Eternal Sakura is an immersive, scroll-driven digital love letter by Prakhar Dev — an interactive romantic website crafted with sakura petals, memories, and animated timelines.",

  keywords: [
    "Eternal Sakura",
    "interactive digital love letter",
    "romantic scroll animation website",
    "creative valentine website project",
    "interactive love story website",
    "Prakhar Dev portfolio",
    "next.js valentine idea",
    "webgl love letter",
    "animated relationship timeline",
    "digital anniversary gift",
    "sakura animation website",
  ],

  authors: [{ name: "Prakhar Dev", url: "https://sakura.perkkk.dev" }],
  creator: "Prakhar Dev",
  publisher: "Prakhar Dev",

  metadataBase: new URL("https://sakura.perkkk.dev"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Eternal Sakura",
    description:
      "An immersive love letter written in sakura petals and light — every scroll reveals a memory, every heartbeat counts the days.",
    siteName: "Eternal Sakura",
    url: "https://sakura.perkkk.dev",
    images: [
      {
        url: "https://sakura.perkkk.dev/genesis/ezgif-frame-100.jpg",
        width: 1200,
        height: 630,
        alt: "Eternal Sakura – Interactive Digital Love Letter",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Eternal Sakura",
    description:
      "An immersive, scroll-driven digital love letter crafted with sakura petals and memories.",
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
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: "Eternal Sakura",
              author: {
                "@type": "Person",
                name: "Prakhar Dev",
                url: "https://sakura.perkkk.dev",
              },
              description:
                "An interactive digital love letter crafted with scroll-driven animation, sakura petals, and a romantic timeline.",
              url: "https://sakura.perkkk.dev",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
