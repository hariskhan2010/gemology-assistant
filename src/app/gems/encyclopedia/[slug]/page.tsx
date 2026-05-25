"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Loader2, Bookmark } from "lucide-react";
import { gemstones } from "@/lib/knowledge/gemstones";
import { notFound } from "next/navigation";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function GemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const gem = gemstones.find((g) => g.slug === slug);
  usePageTitle(gem ? `${gem.name} – Properties, Price & Treatments` : "Gem Guide");

  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!gem) return;
    fetch("/api/gems/saved")
      .then((r) => r.json())
      .then((data) => {
        if (data.gems) {
          const found = data.gems.find((g: { name: string; id: string }) => g.name === gem.name);
          if (found) {
            setIsSaved(true);
            setSavedId(found.id);
          }
        }
      })
      .catch(() => {});
  }, [gem]);

  const toggleSave = async () => {
    if (!gem) return;
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved && savedId) {
        const res = await fetch("/api/gems/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: savedId }),
        });
        if (res.ok) {
          setIsSaved(false);
          setSavedId(null);
        }
      } else {
        const res = await fetch("/api/gems/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: gem.name,
            description: gem.description.slice(0, 200),
            image: null,
            properties: [{ hardness: `${gem.mohs} Mohs` }, { color: gem.color }, { crystal: gem.crystal }],
          }),
        });
        const data = await res.json();
        if (data.gem) {
          setIsSaved(true);
          setSavedId(data.gem.id);
        }
      }
    } catch {}
    setSaving(false);
  };

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
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Encyclopedia", href: "/gems/encyclopedia" },
          { label: gem.name },
        ]} />

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
              <button
                onClick={toggleSave}
                disabled={saving}
                className={`w-full rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSaved
                    ? "bg-gemstone-600/20 text-gemstone-400 hover:bg-gemstone-600/30"
                    : "bg-gemstone-600 text-white hover:bg-gemstone-500"
                }`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-gemstone-400" : ""}`} />
                )}
                {isSaved ? "Saved" : "Save Gem"}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Gems */}
        <div className="mt-12">
          <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">Similar Gems</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gemstones
              .filter((g) => g.category === gem.category && g.slug !== gem.slug)
              .slice(0, 3)
              .map((similar) => (
                <Link
                  key={similar.slug}
                  href={`/gems/encyclopedia/${similar.slug}`}
                  className="rounded-xl border border-border bg-surface p-4 hover:border-gemstone-500/50 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary hover:text-gemstone-400 transition-colors">{similar.name}</h3>
                    <Link
                      href={`/gems/compare?add=${similar.slug}`}
                      className="text-xs text-gemstone-400 hover:text-gemstone-300 transition-colors"
                    >
                      Compare
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{similar.mohs} Mohs · {similar.category}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
