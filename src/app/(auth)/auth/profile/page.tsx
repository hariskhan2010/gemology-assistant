import type { Metadata } from "next";
import ProfilePage from "./PageContent";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your GemSage profile, update your name, change your password, or delete your account.",
  openGraph: { title: "Profile Settings | GemSage", description: "Manage your GemSage account settings." },
};

export default function Page() {
  return <ProfilePage />;
}
