export default function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gemstone-900/40 via-background to-sapphire-500/20" />
      
      {/* Animated orbs */}
      <div className="animate-orb-slow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gemstone-600/20 blur-3xl" />
      <div className="animate-orb-medium absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sapphire-500/15 blur-3xl" />
      <div className="animate-orb-fast absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      
      {/* Light rays */}
      <div className="absolute inset-0 opacity-20">
        <div className="animate-ray absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-gemstone-400/10 to-transparent" style={{ transform: "rotate(25deg)", transformOrigin: "top left" }} />
        <div className="animate-ray-reverse absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-sapphire-400/10 to-transparent" style={{ transform: "rotate(-25deg)", transformOrigin: "top right" }} />
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="animate-float absolute h-1 w-1 rounded-full bg-gemstone-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,background_100%)]" />
    </div>
  );
}
