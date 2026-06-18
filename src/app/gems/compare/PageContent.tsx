"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { gemstones, type GemstoneData } from "@/lib/knowledge/gemstones";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const groups: { label: string; fields: { key: keyof GemstoneData; label: string }[] }[] = [
  {
    label: "General",
    fields: [
      { key: "category", label: "Category" },
      { key: "color", label: "Color" },
    ],
  },
  {
    label: "Physical Properties",
    fields: [
      { key: "mohs", label: "Mohs Hardness" },
      { key: "ri", label: "Refractive Index" },
      { key: "sg", label: "Specific Gravity" },
      { key: "crystal", label: "Crystal System" },
    ],
  },
  {
    label: "Treatment & Origin",
    fields: [
      { key: "treatments", label: "Treatments" },
      { key: "origins", label: "Origins" },
    ],
  },
  {
    label: "Value",
    fields: [
      { key: "priceRange", label: "Price Range" },
    ],
  },
  {
    label: "Description",
    fields: [
      { key: "description", label: "Description" },
    ],
  },
];

export default function ComparePage() {
  usePageTitle("Gem Comparison Tool");
  const [selected, setSelected] = useState<GemstoneData[]>([]);

  const handleAdd = (slug: string) => {
    const gem = gemstones.find((g) => g.slug === slug);
    if (gem && selected.length < 4 && !selected.find((s) => s.slug === slug)) {
      setSelected([...selected, gem]);
    }
  };

  const handleRemove = (slug: string) => {
    setSelected(selected.filter((s) => s.slug !== slug));
  };

  const available = gemstones.filter((g) => !selected.find((s) => s.slug === g.slug));

  const formatValue = (gem: GemstoneData, key: keyof GemstoneData) => {
    const val = gem[key];
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Compare" },
        ]} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Gem Comparison</h1>
          <h2 className="mt-1 text-sm text-text-secondary font-normal">Compare Properties — add up to 4 gemstones to see them side by side</h2>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-xs text-text-muted self-center mr-1">Popular:</span>
          <Link href="/compare/ruby-vs-sapphire" className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-gemstone-500/50 hover:text-gemstone-400 transition-colors">
            Ruby vs Sapphire
          </Link>
          <Link href="/compare/diamond-vs-moissanite" className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-gemstone-500/50 hover:text-gemstone-400 transition-colors">
            Diamond vs Moissanite
          </Link>
          <Link href="/compare/emerald-vs-peridot" className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-gemstone-500/50 hover:text-gemstone-400 transition-colors">
            Emerald vs Peridot
          </Link>
          <Link href="/compare/ruby-vs-garnet" className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-gemstone-500/50 hover:text-gemstone-400 transition-colors">
            Ruby vs Garnet
          </Link>
          <Link href="/compare/diamond-vs-cubic-zirconia" className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-gemstone-500/50 hover:text-gemstone-400 transition-colors">
            Diamond vs CZ
          </Link>
        </div>

        <div className="mb-6">
          {selected.length < 4 && (
            <div className="relative">
              <select
                onChange={(e) => { if (e.target.value) handleAdd(e.target.value); e.target.value = ""; }}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
              >
                <option value="">Add a gemstone to compare...</option>
                {available.map((g) => (
                  <option key={g.slug} value={g.slug}>{g.name} ({g.category})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selected.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
            <Plus className="mb-4 h-12 w-12 text-text-muted" />
            <p className="text-text-muted">Select at least 2 gemstones to compare</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 bg-background px-4 py-3 text-left text-xs font-medium text-text-muted min-w-[140px]">Property</th>
                  {selected.map((gem) => (
                    <th key={gem.slug} className="bg-background px-4 py-3 text-left min-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary">{gem.name}</span>
                        <button onClick={() => handleRemove(gem.slug)} className="rounded p-0.5 text-text-muted hover:text-ruby-500">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <React.Fragment key={group.label}>
                    <tr className="border-b border-border bg-surface-elevated/50">
                      <td className="sticky left-0 bg-surface-elevated/50 px-4 py-2" colSpan={selected.length + 1}>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{group.label}</h3>
                      </td>
                    </tr>
                    {group.fields.map((field) => (
                      <tr key={field.key} className="border-b border-border last:border-0">
                        <td className="sticky left-0 bg-background px-4 py-3 text-xs font-medium text-text-muted">{field.label}</td>
                        {selected.map((gem) => (
                          <td key={gem.slug} className="px-4 py-3 text-text-primary">
                            {field.key === "description" ? (
                              <p className="line-clamp-3 text-xs leading-relaxed">{formatValue(gem, field.key)}</p>
                            ) : (
                              <span className={field.key === "priceRange" ? "text-gemstone-400 text-xs" : "text-xs"}>
                                {formatValue(gem, field.key)}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
