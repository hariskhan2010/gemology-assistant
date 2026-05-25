import type { Metadata } from "next";
import { gemstones } from "@/lib/knowledge/gemstones";
import GemDetailPage from "./PageContent";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const gem = gemstones.find((g) => g.slug === params.slug);
  if (!gem) return { title: "Gem Guide" };
  return {
    title: `${gem.name} – Properties, Price & Treatments`,
    description: `Learn about ${gem.name}: ${gem.mohs} Mohs hardness, ${gem.color}, price range ${gem.priceRange}. Common treatments include ${gem.treatments.join(", ") || "none"}.`,
    openGraph: {
      title: `${gem.name} – Properties, Price & Treatments | GemSage`,
      description: `${gem.name} gemstone guide: ${gem.mohs} Mohs, ${gem.color}, price ${gem.priceRange}.`,
    },
  };
}

export default function Page() {
  return <GemDetailPage />;
}
