import type { Metadata } from "next";
import { comparisons } from "@/lib/knowledge/comparisons";
import ComparisonPage from "./PageContent";

export async function generateMetadata({ params }: { params: { pair: string } }): Promise<Metadata> {
  const comparison = comparisons.find((c) => c.slug === params.pair);
  if (!comparison) return { title: "Comparison Not Found" };
  return {
    title: comparison.title,
    description: comparison.description,
    openGraph: {
      title: `${comparison.title} | GemSage`,
      description: comparison.description,
    },
  };
}

export default function Page() {
  return <ComparisonPage />;
}
