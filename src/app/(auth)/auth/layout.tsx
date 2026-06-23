import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Authentication | StoneWise",
    template: "%s | StoneWise",
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
