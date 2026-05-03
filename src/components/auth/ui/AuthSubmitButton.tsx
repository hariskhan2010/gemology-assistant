import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const AuthSubmitButton = forwardRef<HTMLButtonElement, AuthSubmitButtonProps>(
  ({ className, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center justify-center rounded-md bg-gemstone-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-gemstone-600/30 transition-all duration-200 hover:bg-gemstone-500 hover:-translate-y-0.5 hover:shadow-gemstone-500/40 focus:outline-none focus:ring-2 focus:ring-gemstone-400 focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
AuthSubmitButton.displayName = "AuthSubmitButton";

export { AuthSubmitButton };
