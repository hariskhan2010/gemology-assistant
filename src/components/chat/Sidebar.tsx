"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Plus, Search, Settings, LogOut, Gem, User, Headphones } from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceMode?: () => void;
  user: SessionUser | null;
}

export function Sidebar({ isOpen, onClose, onVoiceMode, user }: SidebarProps) {
  const { conversations, activeConversation, setActiveConversation, createNewConversation, deleteConversation } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [imgError, setImgError] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/auth";
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background-secondary transition-transform duration-300 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <Link href="/" className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-gemstone-500" />
            <span className="font-heading text-lg font-bold text-text-primary">GemSage</span>
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={onClose} className="lg:hidden text-text-muted hover:text-text-primary">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => { createNewConversation(); onClose(); }}
            className="flex w-full items-center gap-2 rounded-md bg-gemstone-600/20 px-3 py-2 text-sm font-medium text-gemstone-400 hover:bg-gemstone-600/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gemstone-500 focus:outline-none focus:ring-1 focus:ring-gemstone-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">No conversations found</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((conv) => (
                <li key={conv.id} className="group relative">
                  <button
                    onClick={() => { setActiveConversation(conv.id); onClose(); }}
                    className={cn(
                      "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      activeConversation?.id === conv.id
                        ? "bg-surface-elevated text-text-primary"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    <p className="truncate font-medium">{conv.title}</p>
                    <p className="text-xs text-text-muted">{formatTime(conv.updatedAt)}</p>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted opacity-0 transition-all hover:text-ruby-500 group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4">
          {onVoiceMode && (
            <button
              onClick={onVoiceMode}
              className="mb-3 flex w-full items-center gap-3 rounded-md bg-surface px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Headphones className="h-4 w-4" />
              <span>Voice Mode</span>
            </button>
          )}
          <Link href="/auth/profile" className="flex items-center gap-3 rounded-md p-1.5 hover:bg-surface transition-colors group">
            {user?.picture && !imgError ? (
              <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" onError={() => setImgError(true)} />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gemstone-600/30 text-gemstone-400">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name || "Guest"}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || "Not signed in"}</p>
            </div>
            {user ? (
              <button onClick={(e) => { e.preventDefault(); handleSignOut(); }} className="rounded p-1.5 text-text-muted hover:text-ruby-500 transition-colors" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <span className="rounded p-1.5 text-text-muted" title="Sign in">
                <Settings className="h-4 w-4" />
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
