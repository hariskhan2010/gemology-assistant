import { type ComponentProps, type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends ComponentProps<"input"> {
  label: string;
  icon?: ReactNode;
  error?: string;
  rightElement?: ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, rightElement, className, id, ...props }, ref) => {
    const hasIcon = !!icon;
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-md border border-border bg-surface px-4 py-2.5 text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500",
              hasIcon && "pl-10",
              rightElement && "pr-10",
              error && "border-ruby-500 focus:border-ruby-500 focus:ring-ruby-500",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-ruby-500">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };
