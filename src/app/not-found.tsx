"use client";

import Link from "next/link";
import { Gem, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mb-8">
        <Gem className="mx-auto h-16 w-16 text-gemstone-500/50" />
      </div>
      <h1 className="font-heading text-6xl font-bold text-text-primary">404</h1>
      <p className="mt-4 text-lg text-text-secondary">Page not found</p>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-gemstone-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gemstone-500"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
