import type { Metadata } from "next";
import SignUpPage from "./PageContent";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free GemSage account for AI gemstone identification, faceting guides, and your personal gem collection.",
  openGraph: { title: "Sign Up | GemSage", description: "Create a free GemSage account for AI-powered gemology." },
};

export default function Page() {
  return <SignUpPage />;
}
