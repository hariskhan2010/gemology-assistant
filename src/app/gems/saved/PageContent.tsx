"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { Trash2, Loader2, Gem, ExternalLink, ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageTitle } from "@/hooks/use-page-title";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

function SavedGemImage({ src, alt }: { src: string; alt: string }): ReactNode {
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} loading="lazy" className="h-32 w-full object-contain" />;
  }
  return (
    <div className="relative h-32 w-full">
      <NextImage src={src} alt={alt} fill className="object-contain" unoptimized sizes="(max-width: 768px) 100vw, 33vw" />
    </div>
  );
}

interface SavedGem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  properties: string | null;
  created_at: string;
}

export default function SavedGemsPage() {
  usePageTitle("Saved Gem Collection");
  const router = useRouter();
  const [gems, setGems] = useState<SavedGem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gems/saved")
      .then((res) => res.json())
      .then((data) => {
        if (data.gems) setGems(data.gems);
        else router.push("/auth/signin");
      })
      .catch(() => router.push("/auth/signin"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    await fetch("/api/gems/saved", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setGems((prev) => prev.filter((g) => g.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gemstone-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Saved Gems" },
        ]} />

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Saved Gems</h1>
          <p className="mt-1 text-sm text-text-secondary">Gemstones you've identified and bookmarked</p>
        </div>

        {gems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
            <Gem className="mb-4 h-12 w-12 text-text-muted" />
            <h3 className="text-lg font-medium text-text-primary">No saved gems yet</h3>
            <p className="mt-1 text-sm text-text-muted">Identify a gemstone in the assistant and save it here</p>
            <Link href="/assistant" className="mt-4 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors">
              Go to Assistant
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gems.map((gem) => (
              <div key={gem.id} className="group relative rounded-xl border border-border bg-surface p-5 hover:border-gemstone-500/50 transition-colors">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold text-text-primary">{gem.name}</h3>
                  <button
                    onClick={() => handleDelete(gem.id)}
                    className="rounded p-1 text-text-muted opacity-0 hover:text-ruby-500 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {gem.image && (
                  <div className="mb-3 overflow-hidden rounded-lg bg-background">
                    <SavedGemImage src={gem.image} alt={gem.name} />
                  </div>
                )}
                {gem.description && (
                  <p className="mb-3 text-sm text-text-secondary line-clamp-2">{gem.description}</p>
                )}
                {gem.properties && (
                  <div className="text-xs text-text-muted">
                    {(JSON.parse(gem.properties) as { value?: string; hardness?: string }[]).slice(0, 3).map((p: any, i: number) => (
                      <span key={i} className="mr-2 inline-block rounded bg-surface-elevated px-2 py-0.5">
                        {p.value || p.hardness || ""}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-text-muted">{new Date(gem.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
