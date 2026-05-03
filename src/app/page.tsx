import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, Camera, BookOpen, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "Gem Identification",
    description: "Upload images or describe a gemstone to get instant AI-powered identification with confidence scores.",
    badge: "AI Powered",
  },
  {
    icon: Camera,
    title: "Visual Analysis",
    description: "Capture gems with your camera for real-time analysis of color, clarity, cut, and carat characteristics.",
    badge: "Camera",
  },
  {
    icon: BookOpen,
    title: "Faceting Guidance",
    description: "Get step-by-step faceting instructions with angles, diagrams, and expert tips for any gemstone.",
    badge: "Guide",
  },
  {
    icon: Sparkles,
    title: "Expert Knowledge",
    description: "Access a comprehensive database of gemstone properties, origins, treatments, and market values.",
    badge: "Database",
  },
  {
    icon: Shield,
    title: "Authenticated Advice",
    description: "All recommendations are grounded in gemological standards and verified by industry references.",
    badge: "Verified",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Get immediate answers to your gemology questions through natural conversation with the AI assistant.",
    badge: "Fast",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-gemstone-600/10 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="text-center">
              <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your AI-Powered{" "}
                <span className="bg-gradient-to-r from-gemstone-300 via-gemstone-400 to-emerald-500 bg-clip-text text-transparent">
                  Gemology Expert
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
                Identify gems, master faceting, and unlock the secrets of precious stones with an intelligent assistant built for gemologists, jewelers, and enthusiasts.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/signin" className="group inline-flex h-12 items-center justify-center rounded-md bg-gemstone-600 px-8 text-base font-medium text-white shadow-lg shadow-gemstone-600/30 transition-all hover:bg-gemstone-500 hover:shadow-gemstone-500/40 hover:-translate-y-0.5">
                  Go to Assistant
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-8 text-base font-medium text-text-primary transition-all hover:bg-surface-elevated hover:-translate-y-0.5 hover:border-gemstone-500/50">
                  Explore Features
                </a>
              </div>
            </div>
            {/* Rotating Gemstone */}
            <div className="mt-16 flex justify-center">
              <div className="relative flex items-center justify-center perspective-1000">
                <div className="animate-gem-rotate preserve-3d">
                  <img
                    src="/gem_logo.png"
                    alt="GemSage Gemstone"
                    className="h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80 object-contain"
                    style={{ filter: "drop-shadow(0 0 40px rgba(16, 185, 129, 0.7)) drop-shadow(0 0 80px rgba(16, 185, 129, 0.3))" }}
                  />
                </div>
                <div className="absolute -z-10 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full bg-gemstone-400/30 blur-3xl animate-pulse-slow" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Powerful Features</h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Everything you need to become a gemology expert, powered by cutting-edge AI.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} variant="glass" className="card-3d group">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gemstone-600/20 text-gemstone-400 shadow-inner transition-all group-hover:bg-gemstone-600/30 group-hover:shadow-gemstone-500/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant="default">{feature.badge}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Card variant="glass" className="card-3d text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to Explore Gemstones?</h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Join thousands of gemologists and enthusiasts using GemSage to unlock the world of precious stones.
            </p>
            <Link href="/auth" className="group mt-8 inline-flex h-12 items-center justify-center rounded-md bg-gemstone-600 px-8 text-base font-medium text-white shadow-lg shadow-gemstone-600/30 transition-all hover:bg-gemstone-500 hover:shadow-gemstone-500/40 hover:-translate-y-0.5">
              Get Started Now
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
