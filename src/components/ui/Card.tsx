import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-surface shadow-xl shadow-gemstone-900/20",
      glass: "bg-surface/60 backdrop-blur-md border border-border/50 shadow-xl shadow-gemstone-900/20",
      bordered: "bg-transparent border border-border",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-6",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };
