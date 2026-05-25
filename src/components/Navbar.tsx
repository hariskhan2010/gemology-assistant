import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-lg shadow-gemstone-900/20" role="banner">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="group flex items-center gap-2 text-xl font-bold font-heading" aria-label="GemSage Home">
          <div className="perspective-1000">
            <div className="animate-gem-rotate preserve-3d">
              <Image
                src="/gem_logo.png"
                alt="GemSage Logo"
                width={40}
                height={40}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))" }}
              />
            </div>
          </div>
          <span className="bg-gradient-to-r from-gemstone-300 to-emerald-500 bg-clip-text text-transparent">
            GemSage
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/gems/encyclopedia" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Encyclopedia
            </Link>
            <Link href="/gems/compare" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Compare
            </Link>
            <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </Link>
          </div>
          <Link href="/assistant" className="text-sm px-4 py-2 rounded-md bg-gemstone-600 text-white shadow-md shadow-gemstone-600/20 hover:bg-gemstone-500 hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Open Assistant
          </Link>
        </div>
      </nav>
    </header>
  );
}
