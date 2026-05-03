"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthInput } from "@/components/auth/ui/AuthInput";
import { AuthSubmitButton } from "@/components/auth/ui/AuthSubmitButton";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gemstone-600/20 text-gemstone-400">
          <Mail className="h-8 w-8" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-bold text-text-primary">Check your email</h2>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ve sent a password reset link to <strong className="text-text-primary">{email}</strong>
          </p>
        </div>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-sm text-gemstone-400 hover:text-gemstone-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gemstone-400 transition-colors mb-4 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Sign In
        </Link>
        <h2 className="font-heading text-3xl font-bold text-text-primary">Reset password</h2>
        <p className="mt-2 text-sm text-text-secondary">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      {error && (
        <div className="rounded-md border border-ruby-500/30 bg-ruby-500/10 px-4 py-3 text-sm text-ruby-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <AuthInput
          id="forgot-email"
          name="forgot-email-field"
          label="Email"
          type="text"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="nope"
        />

        <AuthSubmitButton type="submit" isLoading={isLoading}>
          Send Reset Link
        </AuthSubmitButton>
      </form>
    </div>
  );
}
