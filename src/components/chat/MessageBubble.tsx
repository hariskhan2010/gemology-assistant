"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, easeOut } from "@/lib/utils";
import { X, Volume2, Square } from "lucide-react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { MermaidBlock } from "./MermaidBlock";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  image?: string;
  timestamp: Date;
  onRetry?: () => void;
}

export function MessageBubble({ role, content, image, timestamp, onRetry }: MessageBubbleProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const { isSpeaking, isSupported, speak, stop } = useTextToSpeech();

  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let isMermaid = false;
    let codeContent = "";
    let codeKey = 0;
    let listItems: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="ml-4 list-disc space-y-1 my-2">
            {listItems.map((item, i) => <li key={i}>{formatInline(item)}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          flushList();
          if (isMermaid) {
            elements.push(<MermaidBlock key={`mermaid-${codeKey++}`} code={codeContent} />);
          } else {
            elements.push(
              <pre key={`code-${codeKey++}`} className="my-3 rounded-lg bg-surface-elevated p-4 overflow-x-auto border border-border/50">
                <code className="text-sm font-mono text-text-secondary leading-relaxed">{codeContent}</code>
              </pre>
            );
          }
          codeContent = "";
          inCodeBlock = false;
          isMermaid = false;
        } else {
          flushList();
          inCodeBlock = true;
          isMermaid = line.trim() === "```mermaid";
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += (codeContent ? "\n" : "") + line;
        continue;
      }

      if (line.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={`h3-${i}`} className="text-base font-semibold text-text-primary mt-4 mb-2">{formatInline(line.slice(4))}</h3>);
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={`h2-${i}`} className="text-lg font-semibold text-text-primary mt-4 mb-2">{formatInline(line.slice(3))}</h2>);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(line.slice(2));
      } else if (/^\d+\.\s/.test(line)) {
        flushList();
        elements.push(
          <div key={`oli-${i}`} className="ml-4 flex gap-2 my-1">
            <span className="text-text-muted shrink-0">{formatInline(line.match(/^\d+\.\s/)?.[0] || "")}</span>
            <span>{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
          </div>
        );
      } else if (line.trim() === "") {
        flushList();
        elements.push(<div key={`br-${i}`} className="h-2" />);
      } else {
        flushList();
        elements.push(<p key={`p-${i}`} className="my-1">{formatInline(line)}</p>);
      }
    }

    flushList();
    return elements;
  };

  const formatInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="rounded bg-surface-elevated px-1.5 py-0.5 text-xs font-mono text-gemstone-400">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (role === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center py-4"
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-xs text-text-muted backdrop-blur-sm">
          <span>{formatContent(content)}</span>
          <span className="text-text-muted/60">{formatTime(timestamp)}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: easeOut as any }}
        className={cn(
          "flex gap-3 py-4 group",
          role === "user" ? "justify-end" : "justify-start"
        )}
      >
        {role === "assistant" && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gemstone-600/30 text-gemstone-400 shadow-inner">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        )}
        <div className={cn(
          "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          role === "user"
            ? "bg-gemstone-600 text-white rounded-tr-md"
            : "bg-surface text-text-primary rounded-tl-md border border-border/50"
        )}>
          {image && (
            <div className="mb-3">
              <img
                src={image}
                alt="Attached"
                className="max-h-64 rounded-lg cursor-pointer object-contain bg-black/20 transition-transform hover:scale-[1.02]"
                onClick={() => setImageModalOpen(true)}
              />
            </div>
          )}
          <div className={role === "user" ? "" : "space-y-1"}>
            {formatContent(content)}
          </div>
          <div className={cn(
            "mt-2 flex items-center justify-between",
            role === "user" ? "text-white/60" : "text-text-muted"
          )}>
            <span className="text-xs">{formatTime(timestamp)}</span>
            <div className="flex items-center gap-1">
              {role === "assistant" && isSupported && (
                <button
                  type="button"
                  onClick={isSpeaking ? stop : () => speak(content)}
                  className={`rounded p-1 text-text-muted transition-colors ${
                    isSpeaking ? "text-gemstone-400" : "opacity-0 group-hover:opacity-100 hover:text-text-primary"
                  }`}
                  aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
                >
                  {isSpeaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              )}
              {role === "assistant" && onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-primary"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
        {role === "user" && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary border border-border/50">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </motion.div>

      {imageModalOpen && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setImageModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] max-w-[90vw]"
          >
            <img src={image} alt="Full size" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-3 -right-3 rounded-full bg-surface p-1.5 text-text-muted hover:text-text-primary border border-border shadow-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
