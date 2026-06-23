"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Gem } from "lucide-react";
import { easeOut } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left side - Cinematic background */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex perspective-1000">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut as any }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="animate-gem-rotate preserve-3d"
            >
              <Image
                src="/gem_logo.webp"
                alt="StoneWise Gemstone"
                width={96}
                height={96}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))" }}
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading text-4xl font-bold text-text-primary"
            >
              Welcome to StoneWise
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md text-lg text-text-secondary"
            >
              Your AI-powered gemology assistant. Identify gems, master faceting, and unlock the secrets of precious stones.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex gap-2"
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-gemstone-400"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-gemstone-500"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gemstone-900/60 via-background to-jade-500/40">
          <div className="animate-orb-slow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gemstone-600/30 blur-3xl" />
          <div className="animate-orb-medium absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-jade-500/20 blur-3xl" />
          <div className="animate-orb-fast absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gemstone-400/40"
              style={{
                left: `${(i * 5.1) % 100}%`,
                top: `${(i * 7.3) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i * 0.3) % 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right side - Auth form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easeOut as any }}
        className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12"
      >
        {/* Mobile logo */}
        <Link href="/" className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <Gem className="h-6 w-6 text-gemstone-400" />
          <span className="font-heading text-lg font-bold text-text-primary">StoneWise</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
