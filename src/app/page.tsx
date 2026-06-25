"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { easeOut } from "@/lib/utils";
import { Search, Camera, BookOpen, Sparkles, Shield, Library, Bookmark, ImageIcon, User, Gem, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import GemOfTheDay from "@/components/GemOfTheDay";

const features = [
  {
    icon: Search,
    title: "Gem Identification",
    description: "Upload images or describe a gemstone to get instant AI-powered identification with confidence scores.",
    badge: "AI Powered",
    href: "/assistant",
  },
  {
    icon: Camera,
    title: "Visual Analysis",
    description: "Capture gems with your camera for real-time analysis of color, clarity, cut, and carat characteristics.",
    badge: "Camera",
    href: "/assistant",
  },
  {
    icon: BookOpen,
    title: "Faceting Guidance",
    description: "Get step-by-step faceting instructions with angles, diagrams, and expert tips for any gemstone.",
    badge: "Guide",
    href: "/assistant",
  },
  {
    icon: Library,
    title: "Gemstone Encyclopedia",
    description: "Browse a comprehensive directory of gemstones with detailed properties, origins, treatments, and price ranges.",
    badge: "Reference",
    href: "/gems/encyclopedia",
  },
  {
    icon: Bookmark,
    title: "Saved Gem Collection",
    description: "Bookmark identified stones and build your personal gem collection for easy reference.",
    badge: "Library",
    href: "/gems/saved",
  },
  {
    icon: ImageIcon,
    title: "Image History",
    description: "Browse all previously uploaded gem photos in one place with full-size preview.",
    badge: "Gallery",
    href: "/gems/gallery",
  },
  {
    icon: User,
    title: "Profile & Settings",
    description: "Manage your account, change password, and control your preferences including theme.",
    badge: "Account",
    href: "/auth/profile",
  },
  {
    icon: Shield,
    title: "Authenticated Advice",
    description: "All recommendations are grounded in gemological standards and verified by industry references.",
    badge: "Verified",
    href: "/assistant",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

function StatCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-3xl font-bold text-gemstone-400 sm:text-4xl">
        {count}{suffix}
      </div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  );
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: easeOut as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section style={{ opacity: heroOpacity }} className="relative overflow-hidden">
          <motion.div style={{ scale: heroScale }} className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-12">
              {/* Left: Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: easeOut as any }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={heroLoaded ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-gemstone-500/30 bg-gemstone-600/10 px-4 py-1.5 text-sm text-gemstone-400"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>AI-Powered Gemology Assistant</span>
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15, ease: easeOut as any }}
                  className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Your AI-Powered{" "}
                  <span className="text-shimmer">
                    Gemology Expert
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.25, ease: easeOut as any }}
                  className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary lg:mx-0"
                >
                  Identify gems, master faceting, and unlock the secrets of precious stones with an intelligent assistant built for gemologists, jewelers, and enthusiasts.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35, ease: easeOut as any }}
                  className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
                >
                  <Link href="/auth/signin" className="group inline-flex h-12 items-center justify-center rounded-md bg-gemstone-600 px-8 text-base font-medium text-white shadow-lg shadow-gemstone-600/30 transition-all hover:bg-gemstone-500 hover:shadow-gemstone-500/40 hover:-translate-y-0.5">
                    Go to Assistant
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-8 text-base font-medium text-text-primary transition-all hover:bg-surface-elevated hover:-translate-y-0.5 hover:border-gemstone-500/50">
                    Explore Features
                  </a>
                </motion.div>
              </div>

              {/* Right: Rotating Gemstone */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.45, ease: easeOut as any }}
                className="flex-shrink-0"
              >
                <div className="relative flex items-center justify-center perspective-1000">
                  <div className="animate-gem-rotate preserve-3d" style={{ backfaceVisibility: "visible" }}>
                    <img
                      src="/gem_logo.png"
                      alt="StoneWise Gemstone"
                      width={320}
                      height={320}
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16 flex justify-center"
            >
              <motion.a
                href="#features"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <ChevronDown className="h-6 w-6" />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Gem of the Day */}
        <GemOfTheDay />

        {/* Stats Section */}
        <AnimatedSection>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-sm px-8 py-12 sm:grid-cols-4">
              <StatCounter target={25} suffix="+" label="Gemstones Covered" />
              <StatCounter target={12} suffix="+" label="Faceting Designs" />
              <StatCounter target={50} suffix="+" label="Knowledge Articles" />
              <StatCounter target={1000} suffix="+" label="Happy Users" />
            </div>
          </section>
        </AnimatedSection>

        {/* Features Grid */}
        <AnimatedSection>
          <section id="features" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-heading text-3xl font-bold sm:text-4xl"
              >
                Powerful Features
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto mt-4 max-w-2xl text-text-secondary"
              >
                Everything you need to become a gemology expert, powered by cutting-edge AI.
              </motion.p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={itemVariants}>
                    <Link href={feature.href}>
                      <Card variant="glass" className="card-3d group cursor-pointer h-full">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gemstone-600/20 text-gemstone-400">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{feature.title}</h3>
                          <Badge variant="default">{feature.badge}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Card variant="glass" className="card-3d text-center relative overflow-hidden">
              <div className="relative">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="font-heading text-3xl font-bold sm:text-4xl"
                >
                  Ready to Explore Gemstones?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mx-auto mt-4 max-w-xl text-text-secondary"
                >
                  Join thousands of gemologists and enthusiasts using StoneWise to unlock the world of precious stones.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/auth/signup" className="group mt-8 inline-flex h-12 items-center justify-center rounded-md bg-gemstone-600 px-8 text-base font-medium text-white shadow-lg shadow-gemstone-600/30 transition-all hover:bg-gemstone-500 hover:shadow-gemstone-500/40 hover:-translate-y-0.5">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </Card>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
