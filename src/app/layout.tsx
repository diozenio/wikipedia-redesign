import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { APPEARANCE_SCRIPT } from "@/ui/lib/appearance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Opt-in reading font, so it is not preloaded for every visitor.
const openDyslexic = localFont({
  variable: "--font-opendyslexic",
  display: "swap",
  preload: false,
  src: [
    {
      path: "./fonts/opendyslexic/opendyslexic-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/opendyslexic/opendyslexic-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/opendyslexic/opendyslexic-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/opendyslexic/opendyslexic-latin-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Sistema de informação – Wikipédia",
  description: "Wikipédia, a enciclopédia livre.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      data-font-scale="100"
      data-spacing="default"
      className={`${geistSans.variable} ${geistMono.variable} ${openDyslexic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static script that applies saved appearance before the first paint
          dangerouslySetInnerHTML={{ __html: APPEARANCE_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
