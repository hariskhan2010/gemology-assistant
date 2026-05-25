import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Authentication | GemSage",
    template: "%s | GemSage",
  },
};

export const dynamic = "force-dynamic";

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
