import type { Metadata } from "next";
import ResetPasswordPage from "./PageContent";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your GemSage account.",
  openGraph: { title: "Reset Password | GemSage", description: "Set a new password for your GemSage account." },
};

export default function Page() {
  return <ResetPasswordPage />;
}
