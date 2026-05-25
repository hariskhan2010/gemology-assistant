"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";
import { usePageTitle } from "@/hooks/use-page-title";

export default function SignInPage() {
  usePageTitle("Sign In");
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
