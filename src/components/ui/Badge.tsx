import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses = {
  default: "bg-gemstone-600/20 text-gemstone-400 border-gemstone-500/30",
  success: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  danger: "bg-ruby-500/20 text-ruby-500 border-ruby-500/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
}
