"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Gem } from "lucide-react";
import { gemstones, categories } from "@/lib/knowledge/gemstones";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const BASE = "https://gemology-assistant.vercel.app";

export default function EncyclopediaPage() {
  usePageTitle("Gemstone Encyclopedia");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = gemstones.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || g.category === category;
    return matchSearch && matchCategory;
  });

  const isFlat = search.length > 0 || category !== "All";
  const categoryDisplay: Record<string, string> = {
    "Precious": "Precious Stones",
    "Semi-Precious": "Semi-Precious Stones",
    "Organic": "Organic Gems",
  };

  const grouped = isFlat
    ? null
    : Object.fromEntries(
        categories.map((cat) => [cat, filtered.filter((g) => g.category === cat)])
      );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Gemstone Encyclopedia",
            description: "Browse 25 gemstones with properties, prices, and treatments",
            url: `${BASE}/gems/encyclopedia`,
            itemListElement: gemstones.map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: g.name,
              url: `${BASE}/gems/encyclopedia/${g.slug}`,
              description: g.description.slice(0, 160),
            })),
          }),
        }}
      />
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Encyclopedia" },
        ]} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Gemstone Encyclopedia</h1>
          <p className="mt-1 text-sm text-text-secondary">Browse and learn about gemstones, their properties, and values</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search gemstones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
            />
          </div>
          <div className="flex gap-2">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-gemstone-600 text-white"
                    : "bg-surface text-text-secondary hover:bg-surface-elevated"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isFlat ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((gem) => (
                <Link
                  key={gem.slug}
                  href={`/gems/encyclopedia/${gem.slug}`}
                  className="group rounded-xl border border-border bg-surface p-5 hover:border-gemstone-500/50 transition-all hover:-translate-y-0.5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold text-text-primary group-hover:text-gemstone-400 transition-colors">{gem.name}</h3>
                    <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-text-muted">{gem.category}</span>
                  </div>
                  <p className="mb-3 text-sm text-text-secondary line-clamp-3">{gem.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                    <span className="rounded bg-gemstone-600/10 px-2 py-0.5">{gem.mohs} Mohs</span>
                    <span className="rounded bg-gemstone-600/10 px-2 py-0.5">RI {gem.ri}</span>
                    <span className="rounded bg-gemstone-600/10 px-2 py-0.5">{gem.crystal}</span>
                  </div>
                  <p className="mt-3 text-xs text-gemstone-400">{gem.color.split(",")[0].trim()}{gem.color.includes(",") ? " + more" : ""}</p>
                </Link>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16">
                <Gem className="mb-4 h-12 w-12 text-text-muted" />
                <p className="text-text-muted">No gemstones found</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => {
              const gems = grouped![cat];
              if (!gems || gems.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="font-heading text-2xl font-bold text-text-primary mb-6 border-b border-border pb-2">{categoryDisplay[cat] || cat}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gems.map((gem) => (
                      <Link
                        key={gem.slug}
                        href={`/gems/encyclopedia/${gem.slug}`}
                        className="group rounded-xl border border-border bg-surface p-5 hover:border-gemstone-500/50 transition-all hover:-translate-y-0.5"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="font-semibold text-text-primary group-hover:text-gemstone-400 transition-colors">{gem.name}</h3>
                          <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-text-muted">{gem.category}</span>
                        </div>
                        <p className="mb-3 text-sm text-text-secondary line-clamp-3">{gem.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                          <span className="rounded bg-gemstone-600/10 px-2 py-0.5">{gem.mohs} Mohs</span>
                          <span className="rounded bg-gemstone-600/10 px-2 py-0.5">RI {gem.ri}</span>
                          <span className="rounded bg-gemstone-600/10 px-2 py-0.5">{gem.crystal}</span>
                        </div>
                        <p className="mt-3 text-xs text-gemstone-400">{gem.color.split(",")[0].trim()}{gem.color.includes(",") ? " + more" : ""}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
