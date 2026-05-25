"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Plus } from "lucide-react";
import { gemstones, type GemstoneData } from "@/lib/knowledge/gemstones";

const fields: { key: keyof GemstoneData; label: string }[] = [
  { key: "category", label: "Category" },
  { key: "color", label: "Color" },
  { key: "mohs", label: "Mohs Hardness" },
  { key: "ri", label: "Refractive Index" },
  { key: "sg", label: "Specific Gravity" },
  { key: "crystal", label: "Crystal System" },
  { key: "treatments", label: "Treatments" },
  { key: "origins", label: "Origins" },
  { key: "priceRange", label: "Price Range" },
  { key: "description", label: "Description" },
];

export default function ComparePage() {
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
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gemstone-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Gem Comparison</h1>
          <p className="mt-1 text-sm text-text-secondary">Compare gemstones side by side</p>
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
                {fields.map((field) => (
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
