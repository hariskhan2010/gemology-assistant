import type { Metadata } from "next";
import ResetPasswordPage from "./PageContent";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your StoneWise account.",
  openGraph: { title: "Reset Password | StoneWise", description: "Set a new password for your StoneWise account." },
};

export default function Page() {
  return <ResetPasswordPage />;
}
