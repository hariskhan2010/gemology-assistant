"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type Conversation, type Message } from "@/lib/types";
import { mockConversations } from "@/lib/mock-data";

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  setActiveConversation: (id: string | null) => void;
  createNewConversation: () => void;
  sendMessage: (content: string, image?: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  retryLastMessage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = activeId
    ? conversations.find((c) => c.id === activeId) || null
    : null;

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  const createNewConversation = useCallback(() => {
    setActiveId(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const streamResponse = async (messages: { role: string; content: string; image?: string }[]): Promise<string> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Failed to get response");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    return fullText;
  };

  const sendMessage = useCallback(async (content: string, image?: string) => {
    setIsLoading(true);
    setError(null);
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      image,
      timestamp: new Date(),
    };

    let targetId: string;

    if (activeId) {
      targetId = activeId;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date() }
            : c
        )
      );
    } else {
      targetId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: targetId,
        title: image ? "Image analysis" : content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(targetId);
    }

    const currentConv = activeId
      ? conversations.find((c) => c.id === activeId)
      : { messages: [userMessage] };

    const apiMessages = (currentConv?.messages || [userMessage]).map((m) => ({
      role: m.role,
      content: m.content,
      image: m.image,
    }));

    try {
      const responseText = await streamResponse(apiMessages);

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date() }
            : c
        )
      );
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorText);

      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "system",
        content: `Error: ${errorText}. Please try again.`,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, errorMessage], updatedAt: new Date() }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeId, conversations]);

  const retryLastMessage = useCallback(async () => {
    if (!activeConversation) return;
    const messages = activeConversation.messages;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    setIsLoading(true);
    setError(null);

    const apiMessages = messages
      .filter((m, i) => i < messages.indexOf(lastUserMessage) + 1)
      .map((m) => ({ role: m.role, content: m.content, image: m.image }));

    try {
      const responseText = await streamResponse(apiMessages);

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date() }
            : c
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to retry";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversation, activeId]);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      isLoading,
      error,
      setActiveConversation,
      createNewConversation,
      sendMessage,
      deleteConversation,
      retryLastMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
