"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const height = useTransform(scrollY, [0, 80], ["5rem", "3.5rem"]);
  const opacity = useTransform(scrollY, [0, 80], [1, 0.85]);
  const borderAlpha = useTransform(scrollY, [0, 80], [0.3, 1]);

  return (
    <motion.header
      style={mounted ? { height, opacity, borderColor: borderAlpha.get() > 0 ? "rgba(26, 58, 48, " + borderAlpha.get() + ")" : "rgba(26, 58, 48, 0.3)" } : {}}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md shadow-lg shadow-gemstone-900/20"
      role="banner"
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="group flex items-center gap-2 text-xl font-bold font-heading shrink-0" aria-label="StoneWise Home">
          <div className="perspective-1000">
            <div className="animate-gem-rotate preserve-3d" style={{ backfaceVisibility: "visible" }}>
              <img
                src="/gem_logo.png"
                alt="StoneWise Logo"
                width={36}
                height={36}
                className="object-contain logo-glow"
              />
            </div>
          </div>
          <span className="bg-gradient-to-r from-gemstone-300 to-emerald-500 bg-clip-text text-transparent">
            StoneWise
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="relative text-sm text-text-secondary hover:text-text-primary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gemstone-400 after:transition-all after:duration-300 hover:after:w-full">
              Home
            </Link>
            <Link href="/gems/encyclopedia" className="relative text-sm text-text-secondary hover:text-text-primary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gemstone-400 after:transition-all after:duration-300 hover:after:w-full">
              Encyclopedia
            </Link>
            <Link href="/blog" className="relative text-sm text-text-secondary hover:text-text-primary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gemstone-400 after:transition-all after:duration-300 hover:after:w-full">
              Blog
            </Link>
          </div>
          <Link href="/assistant" className="text-sm px-4 py-2 rounded-md bg-gemstone-600 text-white shadow-md shadow-gemstone-600/20 hover:bg-gemstone-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gemstone-500/30 transition-all">
            Open Assistant
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
