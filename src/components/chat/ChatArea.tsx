"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { easeOut } from "@/lib/utils";
import { useChat } from "@/lib/chat-context";
import { ChatInput } from "@/components/chat/ChatInput";
import { CameraTalk } from "@/components/chat/CameraTalk";
import { Sparkles, Gem } from "lucide-react";

export function ChatArea() {
  const { activeConversation, isLoading, error, sendMessage, retryLastMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages?.length, isLoading]);

  if (!activeConversation || !activeConversation.messages || activeConversation.messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut as any }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gemstone-600/20 to-emerald-600/10 shadow-inner"
          >
            <Gem className="h-8 w-8 text-gemstone-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-2 font-heading text-2xl font-bold text-text-primary"
          >
            How can I help you today?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-md text-sm text-text-secondary mx-auto"
          >
            Ask me about gemstone identification, properties, faceting techniques, or upload a photo for analysis.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 grid gap-3 sm:grid-cols-2 max-w-lg mx-auto"
          >
            {[
              "What gemstone has a hardness of 7?",
              "How to identify a natural emerald?",
              "Best cutting angles for sapphire",
              "Difference between ruby and garnet",
            ].map((suggestion, i) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.08 }}
                onClick={() => sendMessage(suggestion)}
                className="group rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-text-secondary hover:border-gemstone-500 hover:text-text-primary hover:bg-surface-elevated transition-all cursor-pointer"
              >
                <Sparkles className="h-3 w-3 inline mr-2 text-gemstone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence initial={false}>
          {(activeConversation.messages || []).map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx === activeConversation.messages.length - 1 ? 0 : 0, ease: easeOut as any }}
            >
              <MessageBubble
                role={msg.role}
                content={msg.content}
                image={msg.image}
                timestamp={msg.timestamp}
                onRetry={msg.role === "system" && error ? retryLastMessage : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 py-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gemstone-600/30 text-gemstone-400 shadow-inner">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-surface px-5 py-3 border border-border/50">
              <motion.span
                className="h-2 w-2 rounded-full bg-gemstone-400"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-gemstone-400"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              />
              <motion.span
                className="h-2 w-2 rounded-full bg-gemstone-400"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
