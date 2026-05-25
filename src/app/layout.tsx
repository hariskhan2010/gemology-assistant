import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GemSage - AI Gemology Assistant",
    template: "%s | GemSage",
  },
  description: "Expert gemology guidance powered by AI. Identify gems, learn properties, and master faceting with your intelligent gemology assistant.",
  keywords: ["gemology", "gem identification", "faceting", "gemstones", "AI assistant", "ruby", "sapphire", "emerald"],
  authors: [{ name: "GemSage" }],
  openGraph: {
    title: "GemSage - AI Gemology Assistant",
    description: "Expert gemology guidance powered by AI. Identify gems, learn properties, and master faceting.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#059669",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/sw.js");
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
