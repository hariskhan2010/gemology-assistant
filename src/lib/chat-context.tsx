"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type Conversation, type Message } from "@/lib/types";

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

function getConvMessages(convs: Conversation[], convId: string | null): { role: string; content: string; image?: string }[] {
  if (!convId) return [];
  const conv = convs.find((c) => c.id === convId);
  if (!conv) return [];
  return conv.messages.map((m) => ({ role: m.role, content: m.content, image: m.image }));
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = activeId
    ? conversations.find((c) => c.id === activeId) || null
    : null;

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load conversations");
        return r.json();
      })
      .then((data) => {
        const convs = (data.conversations || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          messages: (c.messages || []).map((m: any) => ({
            id: `msg-${m.timestamp}-${Math.random().toString(36).slice(2)}`,
            role: m.role,
            content: m.content,
            image: m.image || undefined,
            timestamp: new Date(m.timestamp),
          })),
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        }));
        setConversations(convs);
      })
      .catch(() => {});
  }, []);

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  const createNewConversation = useCallback(() => {
    setActiveId(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    fetch("/api/conversations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, [activeId]);

  const doStream = useCallback(async (
    targetId: string,
    assistantId: string,
    apiMessages: { role: string; content: string; image?: string }[],
  ) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, conversationId: targetId }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Failed to get response");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === targetId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: m.content + parsed.text }
                          : m
                      ),
                      updatedAt: new Date(),
                    }
                  : c
              )
            );
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  }, []);

  const sendMessage = useCallback(async (content: string, image?: string) => {
    setIsLoading(true);
    setError(null);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      image,
      timestamp: new Date(),
    };

    const assistantId = `msg-${Date.now() + 1}`;
    const emptyAssistant: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    let targetId = activeId;
    let isNewConv = false;

    if (!targetId) {
      targetId = `conv-${Date.now()}`;
      isNewConv = true;
    }

    const apiMessages = isNewConv
      ? [{ role: userMsg.role, content: userMsg.content, image: userMsg.image }]
      : [
          ...getConvMessages(conversations, activeId),
          { role: userMsg.role, content: userMsg.content, image: userMsg.image },
        ];

    if (isNewConv) {
      const newConv: Conversation = {
        id: targetId,
        title: image ? "Image analysis" : content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        messages: [userMsg, emptyAssistant],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(targetId);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, userMsg, emptyAssistant], updatedAt: new Date() }
            : c
        )
      );
    }

    try {
      await doStream(targetId, assistantId, apiMessages);

      if (isNewConv) {
        fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: image ? "Image analysis" : content.slice(0, 40) + (content.length > 40 ? "..." : ""),
            messages: apiMessages,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorText);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: `Error: ${errorText}. Please try again.`, role: "system" }
                    : m
                ),
                updatedAt: new Date(),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeId, conversations, doStream]);

  const retryLastMessage = useCallback(async () => {
    if (!activeConversation) return;
    const msgs = activeConversation.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    // Remove the last assistant message if there is one
    const lastMsg = msgs[msgs.length - 1];
    const hasTrailingAssistant = lastMsg.role === "assistant" || lastMsg.role === "system";

    if (hasTrailingAssistant) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.slice(0, -1), updatedAt: new Date() }
            : c
        )
      );
    }

    setIsLoading(true);
    setError(null);

    const assistantId = `msg-${Date.now()}`;
    const emptyAssistant: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, emptyAssistant], updatedAt: new Date() }
          : c
      )
    );

    const apiMessages = hasTrailingAssistant
      ? msgs.slice(0, -1).map((m) => ({ role: m.role, content: m.content, image: m.image }))
      : msgs.map((m) => ({ role: m.role, content: m.content, image: m.image }));

    try {
      await doStream(activeId!, assistantId, apiMessages);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Failed to retry";
      setError(errorText);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: `Error: ${errorText}. Please try again.`, role: "system" }
                    : m
                ),
                updatedAt: new Date(),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeConversation, activeId, doStream]);

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