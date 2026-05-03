"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef, useCallback, useRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty("--mouse-x", `${x}%`);
      cardRef.current.style.setProperty("--mouse-y", `${y}%`);
    }, []);

    const variantClasses = {
      default: "bg-surface shadow-xl shadow-gemstone-900/20",
      glass: "bg-surface/60 backdrop-blur-md border border-border/50 shadow-xl shadow-gemstone-900/20",
      bordered: "bg-transparent border border-border",
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
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
