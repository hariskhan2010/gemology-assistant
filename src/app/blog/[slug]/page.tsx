import type { Metadata } from "next";
import { blogArticles } from "@/lib/knowledge/blog";
import BlogArticlePage from "./PageContent";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = blogArticles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | GemSage`,
      description: article.description,
    },
  };
}

export default function Page() {
  return <BlogArticlePage />;
}
