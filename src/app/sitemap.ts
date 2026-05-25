import { gemstones } from "@/lib/knowledge/gemstones";
import { blogArticles } from "@/lib/knowledge/blog";
import { comparisons } from "@/lib/knowledge/comparisons";

const BASE = "https://gemology-assistant.vercel.app";

export default async function sitemap() {
  const staticPages = [
    { url: `${BASE}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE}/assistant`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/gems/encyclopedia`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/gems/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/gems/gallery`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.4 },
    { url: `${BASE}/gems/saved`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.4 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE}/auth/signin`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE}/auth/signup`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE}/auth/profile`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE}/auth/forgot-password`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.2 },
    { url: `${BASE}/auth/reset-password`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.1 },
  ];

  const gemPages = gemstones.map((gem) => ({
    url: `${BASE}/gems/encyclopedia/${gem.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages = blogArticles.map((article) => ({
    url: `${BASE}/blog/${article.slug}`,
    lastModified: new Date(article.published),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparePages = comparisons.map((c) => ({
    url: `${BASE}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...gemPages, ...blogPages, ...comparePages];
}
