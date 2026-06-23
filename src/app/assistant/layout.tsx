"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, Headphones } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatArea } from "@/components/chat/ChatArea";
import { VoiceMode } from "@/components/chat/voice/VoiceMode";
import { CameraTalk } from "@/components/chat/CameraTalk";
import { ChatProvider } from "@/lib/chat-context";
import { usePageTitle } from "@/hooks/use-page-title";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

export default function AssistantLayout() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push("/auth/signin");
        else {
          setUser(data.user);
          setAuthChecked(true);
        }
      })
      .catch(() => router.push("/auth/signin"));
  }, [router]);

  usePageTitle("AI Gemologist Assistant");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [cameraTalkOpen, setCameraTalkOpen] = useState(false);

  if (!authChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gemstone-400" />
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onVoiceMode={() => setVoiceModeOpen(true)} user={user} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="rounded p-1.5 text-text-muted hover:text-text-primary transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-heading text-base font-bold text-text-primary">StoneWise</span>
            <button onClick={() => setVoiceModeOpen(true)} className="rounded p-1.5 text-text-muted hover:text-text-primary transition-colors">
              <Headphones className="h-5 w-5" />
            </button>
          </header>
          <h1 className="sr-only">AI Gemologist Assistant</h1>
          <ChatArea />
          <ChatInput onCameraTalkOpen={() => setCameraTalkOpen(true)} />
        </div>
      </div>
      <VoiceMode isOpen={voiceModeOpen} onClose={() => setVoiceModeOpen(false)} />
      <CameraTalk isOpen={cameraTalkOpen} onClose={() => setCameraTalkOpen(false)} />
    </ChatProvider>
  );
}
