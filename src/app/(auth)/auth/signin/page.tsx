import type { Metadata } from "next";
import SignInPage from "./PageContent";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to GemSage to access AI gem identification, faceting guidance, and your saved gem collection.",
  openGraph: { title: "Sign In | GemSage", description: "Sign in to GemSage for AI-powered gemology assistance." },
};

export default function Page() {
  return <SignInPage />;
}
