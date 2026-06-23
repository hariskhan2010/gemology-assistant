"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
  error: <AlertCircle className="h-5 w-5 text-ruby-400" />,
  info: <Info className="h-5 w-5 text-gemstone-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
};

const borders: Record<ToastType, string> = {
  success: "border-emerald-500/30",
  error: "border-ruby-500/30",
  info: "border-gemstone-500/30",
  warning: "border-yellow-500/30",
};

const backgrounds: Record<ToastType, string> = {
  success: "bg-emerald-500/10",
  error: "bg-ruby-500/10",
  info: "bg-gemstone-500/10",
  warning: "bg-yellow-500/10",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto rounded-lg border p-4 shadow-xl backdrop-blur-md",
                borders[toast.type],
                backgrounds[toast.type],
                "bg-surface/90"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5">{icons[toast.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-1 text-xs text-text-secondary">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 rounded p-0.5 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
