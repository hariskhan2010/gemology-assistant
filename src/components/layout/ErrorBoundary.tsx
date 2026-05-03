"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ruby-500/20">
            <svg className="h-8 w-8 text-ruby-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-surface p-4 text-xs text-text-muted">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = "/"}>
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
