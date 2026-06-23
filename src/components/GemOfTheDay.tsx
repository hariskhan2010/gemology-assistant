"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { gemstones } from "@/lib/knowledge/gemstones";
import { Gem, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { easeOut } from "@/lib/utils";

function getGemOfTheDay() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return gemstones[dayOfYear % gemstones.length];
}

export default function GemOfTheDay() {
  const gem = useMemo(() => getGemOfTheDay(), []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOut as any }}
      >
        <Card variant="glass" className="card-3d relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-orb-slow absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gemstone-600/20 blur-3xl" />
            <div className="animate-orb-medium absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gemstone-500/30 bg-gemstone-600/10 px-3 py-1 text-xs font-medium text-gemstone-400">
                <Sparkles className="h-3.5 w-3.5" />
                Gemstone of the Day
              </div>
              <h3 className="font-heading text-2xl font-bold sm:text-3xl">{gem.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="default">{gem.category}</Badge>
                <span className="inline-flex items-center rounded-full border border-border/50 bg-surface-elevated/50 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  {gem.color.split(",")[0].trim()}
                </span>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-xl">
                {gem.description.split(".")[0]}.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-text-muted text-xs">Mohs</span>
                  <p className="font-medium text-text-primary">{gem.mohs}</p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">Refractive Index</span>
                  <p className="font-medium text-text-primary">{gem.ri}</p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">Specific Gravity</span>
                  <p className="font-medium text-text-primary">{gem.sg}</p>
                </div>
                <div>
                  <span className="text-text-muted text-xs">Crystal System</span>
                  <p className="font-medium text-text-primary">{gem.crystal.split(" ")[0]}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-text-muted text-xs">Price Range</span>
                <p className="text-sm font-semibold text-gemstone-400">{gem.priceRange}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <div className="relative flex items-center justify-center">
                <div className="animate-gem-rotate preserve-3d">
                  <Gem className="h-24 w-24 text-gemstone-400/40" strokeWidth={1} />
                </div>
                <div className="absolute h-20 w-20 rounded-full bg-gemstone-400/15 blur-2xl animate-pulse-slow" />
              </div>
              <Link
                href={`/gems/encyclopedia/${gem.slug}`}
                className="group inline-flex h-10 items-center justify-center rounded-md bg-gemstone-600 px-5 text-sm font-medium text-white shadow-lg shadow-gemstone-600/25 transition-all hover:bg-gemstone-500 hover:shadow-gemstone-500/35 hover:-translate-y-0.5"
              >
                View Full Profile
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
