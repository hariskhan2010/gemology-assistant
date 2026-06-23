import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { ToastProvider } from "@/components/ui/Toast";
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
  metadataBase: new URL("https://gemology-assistant.vercel.app"),
  title: {
    default: "StoneWise - AI Gemology Assistant",
    template: "%s | StoneWise",
  },
  description: "StoneWise is an AI gemologist for instant gem identification, faceting angles, and stone properties. Browse 25+ gemstone guides with prices and hardness ratings. Free to use.",
  keywords: ["gemology", "gem identification", "faceting", "gemstones", "AI assistant", "ruby", "sapphire", "emerald"],
  authors: [{ name: "StoneWise" }],
  openGraph: {
    title: "StoneWise - AI Gemology Assistant",
    description: "StoneWise is an AI gemologist for instant gem identification, faceting angles, and stone properties. Browse 25+ gemstone guides with prices and hardness ratings. Free to use.",
    type: "website",
    locale: "en_US",
    url: "https://gemology-assistant.vercel.app",
    siteName: "StoneWise",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoneWise - AI Gemology Assistant",
    description: "Identify gems, learn properties, and master faceting with AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/gem_logo.png",
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
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "StoneWise",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              description: "AI-powered gemology assistant for gem identification, faceting guidance, and gemstone education.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "StoneWise" },
            }),
          }}
        />
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
