import { cn } from "@/lib/utils";
import { type SVGProps } from "react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = getStrength(password);
  
  if (!password) return null;

  const levels = [
    { label: "Weak", color: "bg-ruby-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-emerald-500" },
    { label: "Strong", color: "bg-emerald-500" },
  ];

  const currentLevel = levels[strength - 1] || levels[0];

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              level <= strength ? currentLevel.color : "bg-surface-elevated"
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-xs transition-colors",
        strength <= 1 ? "text-ruby-500" : strength <= 2 ? "text-yellow-500" : "text-emerald-500"
      )}>
        {currentLevel.label}
      </p>
    </div>
  );
}

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}
