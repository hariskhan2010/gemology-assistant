"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, BookOpen, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { blogArticles } from "@/lib/knowledge/blog";
import { notFound } from "next/navigation";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const article = blogArticles.find((a) => a.slug === slug);
  usePageTitle(article ? `${article.title} | StoneWise` : "Article Not Found");

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push("/auth/signin");
        else setAuthChecked(true);
      })
      .catch(() => router.push("/auth/signin"));
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gemstone-400" />
      </div>
    );
  }

  if (!article) notFound();

  const renderContent = (markdown: string) => {
    const lines = markdown.split("\n");
    const html: string[] = [];
    let inTable = false;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<h2 class="font-heading text-xl font-semibold text-text-primary mt-8 mb-3">${line.slice(3)}</h2>`);
      } else if (line.startsWith("### ")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<h3 class="font-heading text-lg font-semibold text-text-primary mt-6 mb-2">${line.slice(4)}</h3>`);
      } else if (line.startsWith("| ")) {
        const cells = line.split("|").filter(Boolean).map((c) => c.trim());
        if (!inTable) {
          html.push('<div class="overflow-x-auto my-4 rounded-lg border border-border"><table class="w-full text-sm"><tbody>');
          inTable = true;
        }
        const isHeader = line.includes("---") || line.includes("|");
        if (/^[-| ]+$/.test(line.replace(/\|/g, "").trim())) continue;
        html.push(`<tr class="border-b border-border last:border-0">${cells.map((c) => `<td class="px-3 py-2 text-text-primary text-xs">${c}</td>`).join("")}</tr>`);
      } else if (line.startsWith("- **")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<li class="text-sm text-text-secondary ml-4 mb-1">${line.slice(2)}</li>`);
      } else if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<li class="text-sm text-text-secondary ml-4 mb-1 list-decimal">${line.slice(3)}</li>`);
      } else if (line.startsWith("**") && line.endsWith("**")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<p class="text-sm font-semibold text-text-primary mt-4 mb-1">${line.slice(2, -2)}</p>`);
      } else if (line.startsWith("[") && line.includes("](")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          html.push(`<p class="text-sm text-text-secondary mb-2"><a href="${linkMatch[2]}" class="text-gemstone-400 hover:text-gemstone-300 transition-colors">${linkMatch[1]}</a></p>`);
        }
      } else if (line.startsWith("- ")) {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        html.push(`<li class="text-sm text-text-secondary ml-4 mb-1 list-disc">${line.slice(2)}</li>`);
      } else if (line.trim() === "") {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
      } else if (line.startsWith("|")) {
        continue;
      } else {
        if (inTable) { html.push("</tbody></table>"); inTable = false; }
        if (line.trim()) {
          const withLinks = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gemstone-400 hover:text-gemstone-300 transition-colors">$1</a>');
          html.push(`<p class="text-sm text-text-secondary mb-3 leading-relaxed">${withLinks}</p>`);
        }
      }
    }
    if (inTable) html.push("</tbody></table>");

    return <div className="prose-custom" dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.published,
            author: { "@type": "Organization", name: "StoneWise" },
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: article.title },
          ]} />

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-gemstone-600/10 px-3 py-0.5 text-xs font-medium text-gemstone-400">
                <Tag className="h-3 w-3" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
              <span className="text-xs text-text-muted">{new Date(article.published).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">{article.title}</h1>
            <p className="mt-2 text-sm text-text-secondary">{article.description}</p>
          </div>

          <article className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            {renderContent(article.content)}

            <div className="mt-10 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gemstone-400 hover:text-gemstone-300 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
                <Link href="/assistant" className="inline-flex items-center gap-1.5 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  Try StoneWise
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
