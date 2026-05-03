"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthInput } from "@/components/auth/ui/AuthInput";
import { AuthSubmitButton } from "@/components/auth/ui/AuthSubmitButton";
import { AuthDivider } from "@/components/auth/ui/AuthDivider";
import { PasswordStrength } from "@/components/auth/ui/PasswordStrength";

function SignUpFormContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setError(null);
    setAgreedToTerms(false);
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreedToTerms) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      router.push("/assistant");
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
        <h2 className="font-heading text-3xl font-bold text-text-primary">Create account</h2>
        <p className="mt-2 text-sm text-text-secondary">Start your gemology journey today</p>
      </div>

      {error && (
        <div className="rounded-md border border-ruby-500/30 bg-ruby-500/10 px-4 py-3 text-sm text-ruby-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off">
        <AuthInput
          id="signup-name"
          name="signup-name-field"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <AuthInput
          id="signup-email"
          name="signup-email-field"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="nope"
        />
        <div className="space-y-2">
          <AuthInput
            id="signup-password"
            name="signup-password-field"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
          <PasswordStrength password={password} />
        </div>
        <AuthInput
          id="signup-confirm-password"
          name="signup-confirm-password-field"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          icon={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border bg-surface text-gemstone-600 focus:ring-gemstone-500 focus:ring-offset-0"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="text-gemstone-400 hover:text-gemstone-300 transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-gemstone-400 hover:text-gemstone-300 transition-colors">Privacy Policy</a>
          </span>
        </label>

        <AuthSubmitButton type="submit" isLoading={isLoading} disabled={!agreedToTerms}>
          Create Account
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google?redirect=/assistant";
          }}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Continue with Google
        </button>
      </div>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-gemstone-400 hover:text-gemstone-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpForm() {
  return (
    <Suspense fallback={<div className="space-y-8 animate-pulse"><div className="h-8 w-48 bg-surface rounded" /><div className="h-40 bg-surface rounded" /></div>}>
      <SignUpFormContent />
    </Suspense>
  );
}
