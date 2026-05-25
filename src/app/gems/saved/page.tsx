import type { Metadata } from "next";
import SavedGemsPage from "./PageContent";

export const metadata: Metadata = {
  title: "Saved Gem Collection",
  description: "Your bookmarked gemstones. Save gems from the encyclopedia or assistant for quick reference later.",
  openGraph: { title: "Saved Gem Collection | GemSage", description: "Your bookmarked gemstone collection for quick reference." },
};

export default function Page() {
  return <SavedGemsPage />;
}
