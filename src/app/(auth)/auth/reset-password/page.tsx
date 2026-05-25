"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/ui/AuthInput";
import { AuthSubmitButton } from "@/components/auth/ui/AuthSubmitButton";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <AuthLayout>
        <div className="space-y-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ruby-500/20 text-ruby-400">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">Invalid Link</h1>
            <p className="mt-2 text-sm text-text-secondary">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gemstone-400 hover:text-gemstone-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="space-y-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">Password Reset</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Your password has been successfully reset.
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
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div>
          <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gemstone-400 transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Sign In
          </Link>
          <h1 className="font-heading text-3xl font-bold text-text-primary">Reset password</h1>
          <p className="mt-2 text-sm text-text-secondary">Enter your new password below</p>
        </div>

        {error && (
          <div className="rounded-md border border-ruby-500/30 bg-ruby-500/10 px-4 py-3 text-sm text-ruby-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <AuthInput
            id="reset-password"
            name="reset-password-field"
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <AuthInput
            id="reset-confirm-password"
            name="reset-confirm-password-field"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <AuthSubmitButton type="submit" isLoading={isLoading}>
            Reset Password
          </AuthSubmitButton>
        </form>
      </div>
    </AuthLayout>
  );
}
