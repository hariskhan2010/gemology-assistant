"use client";

import { useState } from "react";
import { Menu, Headphones } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatArea } from "@/components/chat/ChatArea";
import { VoiceMode } from "@/components/chat/voice/VoiceMode";
import { CameraTalk } from "@/components/chat/CameraTalk";
import { ChatProvider } from "@/lib/chat-context";

export default function AssistantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [cameraTalkOpen, setCameraTalkOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onVoiceMode={() => setVoiceModeOpen(true)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="rounded p-1.5 text-text-muted hover:text-text-primary transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-heading text-base font-bold text-text-primary">GemSage</span>
            <button onClick={() => setVoiceModeOpen(true)} className="rounded p-1.5 text-text-muted hover:text-text-primary transition-colors">
              <Headphones className="h-5 w-5" />
            </button>
          </header>
          <ChatArea />
          <ChatInput onCameraTalkOpen={() => setCameraTalkOpen(true)} />
        </div>
      </div>
      <VoiceMode isOpen={voiceModeOpen} onClose={() => setVoiceModeOpen(false)} />
      <CameraTalk isOpen={cameraTalkOpen} onClose={() => setCameraTalkOpen(false)} />
    </ChatProvider>
  );
}
