"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImageIcon, X, ZoomIn } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

interface GalleryImage {
  image: string;
  content: string;
  timestamp: string;
  title: string;
}

export default function GalleryPage() {
  usePageTitle("Image Gallery");
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch("/api/gems/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.images) setImages(data.images);
        else router.push("/auth/signin");
      })
      .catch(() => router.push("/auth/signin"))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gemstone-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Link href="/assistant" className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gemstone-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Assistant
        </Link>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Image History</h1>
          <p className="mt-1 text-sm text-text-secondary">All gemstone photos you've uploaded</p>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
            <ImageIcon className="mb-4 h-12 w-12 text-text-muted" />
            <h3 className="text-lg font-medium text-text-primary">No images yet</h3>
            <p className="mt-1 text-sm text-text-muted">Upload a gem photo in the assistant to see it here</p>
            <Link href="/assistant" className="mt-4 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors">
              Go to Assistant
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(img)}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface aspect-square hover:border-gemstone-500/50 transition-all"
              >
                <img src={img.image} alt={img.title} className="h-full w-full object-contain p-2" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="truncate text-sm font-medium text-white">{img.title || "Gem photo"}</p>
                  <p className="text-xs text-white/70">{new Date(img.timestamp).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-surface p-1.5 shadow-lg hover:bg-surface-elevated transition-colors"
            >
              <X className="h-5 w-5 text-text-primary" />
            </button>
            <img src={selected.image} alt={selected.title} className="max-h-[80vh] rounded-xl object-contain" />
            <p className="mt-3 text-center text-sm text-text-secondary">{selected.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
