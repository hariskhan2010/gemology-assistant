"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useChat } from "@/lib/chat-context";

export function ChatArea() {
  const { activeConversation, isLoading, error, retryLastMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isLoading]);

  if (!activeConversation || activeConversation.messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gemstone-600/20">
            <svg className="h-8 w-8 text-gemstone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="mb-2 font-heading text-2xl font-bold text-text-primary">How can I help you today?</h2>
          <p className="max-w-md text-sm text-text-secondary">
            Ask me about gemstone identification, properties, faceting techniques, or upload a photo for analysis.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-lg mx-auto">
            {[
              "What gemstone has a hardness of 7?",
              "How to identify a natural emerald?",
              "Best cutting angles for sapphire",
              "Difference between ruby and garnet",
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-text-secondary hover:border-gemstone-500 hover:text-text-primary transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl">
        {activeConversation.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            image={msg.image}
            timestamp={msg.timestamp}
            onRetry={msg.role === "system" && error ? retryLastMessage : undefined}
          />
        ))}
        {isLoading && (
          <div className="flex gap-3 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gemstone-600/30 text-gemstone-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-surface px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: "0s" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: "0.15s" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
