import type { Metadata } from "next";
import ComparePage from "./PageContent";

export const metadata: Metadata = {
  title: "Gem Comparison Tool",
  description: "Compare up to 4 gemstones side by side across 10 properties including hardness, refractive index, price, and treatments.",
  openGraph: { title: "Gem Comparison Tool | GemSage", description: "Compare gemstones side by side across hardness, price, refractive index, and more." },
};

export default function Page() {
  return <ComparePage />;
}
