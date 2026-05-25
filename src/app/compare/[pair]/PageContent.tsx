"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Columns3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { comparisons } from "@/lib/knowledge/comparisons";
import { gemstones } from "@/lib/knowledge/gemstones";
import { notFound } from "next/navigation";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function ComparisonPage() {
  const { pair } = useParams<{ pair: string }>();
  const comparison = comparisons.find((c) => c.slug === pair);
  usePageTitle(comparison ? comparison.title : "Comparison Not Found");

  if (!comparison) notFound();

  const gemA = gemstones.find((g) => g.name.toLowerCase() === comparison.gemA.toLowerCase());
  const gemB = gemstones.find((g) => g.name.toLowerCase() === comparison.gemB.toLowerCase());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: comparison.title,
            description: comparison.description,
            author: { "@type": "Organization", name: "GemSage" },
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Compare", href: "/gems/compare" },
            { label: comparison.title },
          ]} />

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-text-primary">{comparison.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{comparison.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 mb-6">
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">Overview</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{comparison.intro}</p>
          </div>

          <div className="rounded-xl border border-border overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted min-w-[160px]">Property</th>
                    <th className="px-4 py-3 text-left min-w-[200px]">
                      <Link
                        href={gemA ? `/gems/encyclopedia/${gemA.slug}` : "#"}
                        className="font-semibold text-text-primary hover:text-gemstone-400 transition-colors inline-flex items-center gap-1"
                      >
                        {comparison.gemA}
                        {gemA && <ExternalLink className="h-3 w-3" />}
                      </Link>
                    </th>
                    <th className="px-4 py-3 text-left min-w-[200px]">
                      <Link
                        href={gemB ? `/gems/encyclopedia/${gemB.slug}` : "#"}
                        className="font-semibold text-text-primary hover:text-gemstone-400 transition-colors inline-flex items-center gap-1"
                      >
                        {comparison.gemB}
                        {gemB && <ExternalLink className="h-3 w-3" />}
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.table.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-xs font-medium text-text-muted">{row.label}</td>
                      <td className="px-4 py-3 text-xs text-text-primary">{row.gemA}</td>
                      <td className="px-4 py-3 text-xs text-text-primary">{row.gemB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-gemstone-500/30 bg-gemstone-500/5 p-6 sm:p-8 mb-8">
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">Verdict</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{comparison.conclusion}</p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/gems/compare" className="inline-flex items-center gap-1.5 text-sm text-gemstone-400 hover:text-gemstone-300 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Compare Tool
            </Link>
            <Link href="/assistant" className="inline-flex items-center gap-1.5 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors">
              <Columns3 className="h-4 w-4" />
              Ask GemSage Assistant
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
