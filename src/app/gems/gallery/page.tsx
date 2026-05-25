import type { Metadata } from "next";
import GalleryPage from "./PageContent";

export const metadata: Metadata = {
  title: "Gem Photo Gallery",
  description: "View your uploaded gem photos and identification history. Browse past gemstone identifications with AI analysis results.",
  openGraph: { title: "Gem Photo Gallery | GemSage", description: "Browse your uploaded gemstone photos and identification history." },
};

export default function Page() {
  return <GalleryPage />;
}
