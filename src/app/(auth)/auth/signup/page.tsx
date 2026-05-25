"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";
import { usePageTitle } from "@/hooks/use-page-title";

export default function SignUpPage() {
  usePageTitle("Sign Up");
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
