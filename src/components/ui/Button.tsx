import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gemstone-600 text-white hover:bg-gemstone-500 shadow-lg shadow-gemstone-600/30 hover:shadow-gemstone-500/40 hover:-translate-y-0.5",
  secondary: "bg-surface border border-border text-text-primary hover:bg-surface-elevated hover:-translate-y-0.5 shadow-md",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50",
  danger: "bg-ruby-500 text-white hover:bg-ruby-600 shadow-lg shadow-ruby-500/20 hover:-translate-y-0.5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
