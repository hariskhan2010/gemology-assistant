import type { Metadata } from "next";
import ForgotPasswordPage from "./PageContent";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your GemSage account password. Enter your email to receive a password reset link.",
  openGraph: { title: "Forgot Password | GemSage", description: "Reset your GemSage account password." },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
