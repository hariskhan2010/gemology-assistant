"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthInput } from "@/components/auth/ui/AuthInput";
import { AuthSubmitButton } from "@/components/auth/ui/AuthSubmitButton";
import { AuthDivider } from "@/components/auth/ui/AuthDivider";

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/assistant";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrors({});
    setError(null);
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to sign in");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gemstone-400 transition-colors mb-4 group">
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
        <h2 className="font-heading text-3xl font-bold text-text-primary">Welcome back</h2>
        <p className="mt-2 text-sm text-text-secondary">Sign in to continue your gemology journey</p>
      </div>

      {error && (
        <div className="rounded-md border border-ruby-500/30 bg-ruby-500/10 px-4 py-3 text-sm text-ruby-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <input type="text" name="fake_user" style={{ display: "none" }} tabIndex={-1} autoComplete="username" />
        <input type="password" name="fake_pass" style={{ display: "none" }} tabIndex={-1} autoComplete="current-password" />
        <AuthInput
          id="signin-email"
          name="signin-email"
          label="Email"
          type="text"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="nope"
        />
        <AuthInput
          id="signin-password"
          name="signin-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthInput
          id="signin-password"
          name="signin-password-field"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border-border bg-surface text-gemstone-600 focus:ring-gemstone-500 focus:ring-offset-0" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-gemstone-400 hover:text-gemstone-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton type="submit" isLoading={isLoading}>
          Sign In
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams({ redirect });
            window.location.href = `/api/auth/google?${params.toString()}`;
          }}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Continue with Google
        </button>
      </div>

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-gemstone-400 hover:text-gemstone-300 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="space-y-8 animate-pulse"><div className="h-8 w-48 bg-surface rounded" /><div className="h-20 bg-surface rounded" /></div>}>
      <SignInFormContent />
    </Suspense>
  );
}
