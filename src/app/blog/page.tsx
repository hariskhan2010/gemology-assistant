import type { Metadata } from "next";
import BlogPage from "./PageContent";

export const metadata: Metadata = {
  title: "Gemstone Guides & Tutorials",
  description: "Expert articles on gem identification, comparison guides, treatment education, and pricing. Learn everything about gemstones.",
  openGraph: { title: "Gemstone Guides & Tutorials | StoneWise", description: "Expert articles on gem identification, comparison, treatments, and pricing." },
};

export default function Page() {
  return <BlogPage />;
}
