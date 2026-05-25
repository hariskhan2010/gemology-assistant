"use client";

import Link from "next/link";
import Image from "next/image";
import { Gem } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left side - Cinematic background */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex perspective-1000">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
          <div className="animate-fade-in flex flex-col items-center gap-6">
            <div className="animate-gem-rotate">
              <Image
                src="/gem_logo.webp"
                alt="GemSage Gemstone"
                width={96}
                height={96}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))" }}
              />
            </div>
            <h1 className="font-heading text-4xl font-bold text-text-primary">
              Welcome to GemSage
            </h1>
            <p className="max-w-md text-lg text-text-secondary">
              Your AI-powered gemology assistant. Identify gems, master faceting, and unlock the secrets of precious stones.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="h-2 w-2 rounded-full bg-gemstone-400 animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="h-2 w-2 rounded-full bg-gemstone-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gemstone-900/60 via-background to-jade-500/40">
          <div className="animate-orb-slow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gemstone-600/30 blur-3xl" />
          <div className="animate-orb-medium absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-jade-500/20 blur-3xl" />
          <div className="animate-orb-fast absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="animate-float absolute h-1 w-1 rounded-full bg-gemstone-400/40"
              style={{
                left: `${(i * 5.1) % 100}%`,
                top: `${(i * 7.3) % 100}%`,
                animationDelay: `${(i * 0.3) % 5}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        {/* Mobile logo */}
        <Link href="/" className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <Gem className="h-6 w-6 text-gemstone-400" />
          <span className="font-heading text-lg font-bold text-text-primary">GemSage</span>
        </Link>

        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
