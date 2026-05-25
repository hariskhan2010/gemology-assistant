"use client";

import Link from "next/link";
import { BookOpen, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { blogArticles } from "@/lib/knowledge/blog";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function BlogPage() {
  usePageTitle("Gemstone Guides & Tutorials");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Gemstone Guides & Tutorials</h1>
          <p className="mt-1 text-sm text-text-secondary">Expert articles on gem identification, comparison, values, and care</p>
        </div>

        <div className="space-y-6">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block rounded-xl border border-border bg-surface p-6 hover:border-gemstone-500/50 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gemstone-600/10 px-3 py-0.5 text-xs font-medium text-gemstone-400">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-text-primary group-hover:text-gemstone-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">{article.description}</p>
                  <p className="mt-3 text-xs text-text-muted">{new Date(article.published).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-gemstone-600/10 text-gemstone-400 shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
