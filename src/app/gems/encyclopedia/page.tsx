import type { Metadata } from "next";
import EncyclopediaPage from "./PageContent";

export const metadata: Metadata = {
  title: "Gemstone Encyclopedia",
  description: "Browse 25+ gemstones with detailed properties, price ranges, common treatments, and notable origins. Your complete gemstone reference guide.",
  openGraph: { title: "Gemstone Encyclopedia | StoneWise", description: "Browse 25+ gemstones with detailed properties, price ranges, and treatments." },
};

export default function Page() {
  return <EncyclopediaPage />;
}
