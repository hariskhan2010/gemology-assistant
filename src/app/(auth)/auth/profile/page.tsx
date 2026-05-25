"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, ArrowLeft, Save, Trash2, Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { usePageTitle } from "@/hooks/use-page-title";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function ProfilePage() {
  usePageTitle("Profile Settings");
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete account
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setName(data.user.name);
        } else {
          router.push("/auth/signin");
        }
      })
      .catch(() => router.push("/auth/signin"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "Name updated successfully" });
    } else {
      setMessage({ type: "error", text: data.error || "Failed to update name" });
    }
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage(null);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setPasswordMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMessage({ type: "error", text: data.error || "Failed to change password" });
    }
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") return;
    setIsDeleting(true);

    const res = await fetch("/api/auth/delete-account", { method: "POST" });
    if (res.ok) {
      router.push("/");
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gemstone-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/assistant" className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gemstone-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Assistant
        </Link>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage your account settings</p>
        </div>

        {/* Profile Info */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gemstone-600/20 text-gemstone-400">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{profile?.name}</h2>
              <p className="text-sm text-text-muted">{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 disabled:opacity-50 transition-colors"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              {message && (
                <span className={`text-sm ${message.type === "success" ? "text-gemstone-400" : "text-ruby-400"}`}>
                  {message.text}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-gemstone-400" />
            <h2 className="text-lg font-semibold text-text-primary">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="inline-flex items-center gap-2 rounded-lg bg-gemstone-600 px-4 py-2 text-sm font-medium text-white hover:bg-gemstone-500 disabled:opacity-50 transition-colors"
              >
                {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Change Password
              </button>
              {passwordMessage && (
                <span className={`text-sm ${passwordMessage.type === "success" ? "text-gemstone-400" : "text-ruby-400"}`}>
                  {passwordMessage.text}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Delete Account */}
        <div className="rounded-xl border border-ruby-500/30 bg-ruby-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-ruby-400" />
            <h2 className="text-lg font-semibold text-text-primary">Delete Account</h2>
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            This will permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-48 rounded-lg border border-border bg-background px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-ruby-500 focus:outline-none focus:ring-1 focus:ring-ruby-500"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={confirmDelete !== "DELETE" || isDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-ruby-600 px-4 py-2 text-sm font-medium text-white hover:bg-ruby-500 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
