"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { usePageTitle } from "@/hooks/use-page-title";

export default function ForgotPasswordPage() {
  usePageTitle("Forgot Password");
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
