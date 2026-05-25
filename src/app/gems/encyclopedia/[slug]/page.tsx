"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { gemstones } from "@/lib/knowledge/gemstones";
import { notFound } from "next/navigation";
import { usePageTitle } from "@/hooks/use-page-title";

export default function GemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const gem = gemstones.find((g) => g.slug === slug);
  usePageTitle(gem ? `${gem.name} – Properties, Price & Treatments` : "Gem Guide");

  if (!gem) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: gem.name,
            category: `${gem.category} Gemstone`,
            description: gem.description,
            material: gem.crystal,
            brand: { "@type": "Brand", name: "GemSage" },
          }),
        }}
      />
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/gems/encyclopedia" className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gemstone-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Encyclopedia
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-text-primary">{gem.name}</h1>
              <p className="mt-1 text-sm text-text-secondary">{gem.category}</p>
            </div>
            <span className="rounded-lg bg-gemstone-600/20 px-3 py-1 text-sm font-medium text-gemstone-400">{gem.mohs} Mohs</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 font-heading text-xl font-semibold text-text-primary">Description</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{gem.description}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 font-heading text-xl font-semibold text-text-primary">Physical Properties</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-text-muted">Color</dt>
                  <dd className="text-text-primary">{gem.color}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Mohs Hardness</dt>
                  <dd className="text-text-primary">{gem.mohs}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Refractive Index</dt>
                  <dd className="text-text-primary">{gem.ri}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Specific Gravity</dt>
                  <dd className="text-text-primary">{gem.sg}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-text-muted">Crystal System</dt>
                  <dd className="text-text-primary">{gem.crystal}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 font-heading text-xl font-semibold text-text-primary">Common Treatments</h2>
              {gem.treatments.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {gem.treatments.map((t, i) => (
                    <li key={i} className="rounded-lg bg-surface-elevated px-3 py-1.5 text-xs text-text-secondary">{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">Typically untreated</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 font-heading text-xl font-semibold text-text-primary">Notable Origins</h2>
              <ul className="flex flex-wrap gap-2">
                {gem.origins.map((o, i) => (
                  <li key={i} className="rounded-lg bg-surface-elevated px-3 py-1.5 text-xs text-text-secondary">{o}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gemstone-500/30 bg-gemstone-500/5 p-6">
              <h2 className="mb-3 font-heading text-lg font-semibold text-text-primary">Price Range</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{gem.priceRange}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-3 font-heading text-lg font-semibold text-text-primary">Save to Collection</h2>
              <p className="mb-3 text-xs text-text-muted">Bookmark this gem to reference later</p>
              <button className="w-full rounded-lg bg-gemstone-600 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors">
                Save Gem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
