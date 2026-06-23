import type { Metadata } from "next";
import ProfilePage from "./PageContent";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your StoneWise profile, update your name, change your password, or delete your account.",
  openGraph: { title: "Profile Settings | StoneWise", description: "Manage your StoneWise account settings." },
};

export default function Page() {
  return <ProfilePage />;
}
