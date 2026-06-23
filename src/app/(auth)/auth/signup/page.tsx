import type { Metadata } from "next";
import SignUpPage from "./PageContent";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free StoneWise account for AI gemstone identification, faceting guides, and your personal gem collection.",
  openGraph: { title: "Sign Up | StoneWise", description: "Create a free StoneWise account for AI-powered gemology." },
};

export default function Page() {
  return <SignUpPage />;
}
