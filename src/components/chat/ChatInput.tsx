"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Paperclip, Camera } from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { CameraCapture } from "@/components/chat/media/CameraCapture";
import { VoiceInput } from "@/components/chat/voice/VoiceInput";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSend = async () => {
    const trimmed = value.trim();
    if ((!trimmed && !selectedImage) || isLoading) return;
    const image = selectedImage;
    setValue("");
    setSelectedImage(null);
    await sendMessage(trimmed || "Please analyze this image.", image || undefined);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    if (text) {
      setValue((prev) => (prev ? `${prev} ${text}` : text));
    }
  };

  const handleImageSelect = (base64: string) => {
    setSelectedImage(base64);
  };

  const handleImageClear = () => {
    setSelectedImage(null);
  };

  const handleCameraCapture = (base64: string) => {
    setSelectedImage(base64);
  };

  return (
    <>
      <div className="border-t border-border bg-background-secondary p-4">
        <div className="mx-auto max-w-3xl">
          {selectedImage && (
            <div className="mb-2 flex gap-2">
              <img
                src={selectedImage}
                alt="Attachment"
                className="h-16 w-16 rounded-lg object-cover border border-border"
              />
              <button
                onClick={handleImageClear}
                className="self-start rounded p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-lg border border-border bg-surface p-2 transition-colors focus-within:border-gemstone-500">
            <button
              className="shrink-0 rounded p-1.5 text-text-muted hover:text-text-primary transition-colors"
              title="Upload image"
              onClick={() => document.getElementById("chat-image-input")?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <input
                id="chat-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setSelectedImage(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </button>
            <button
              className="shrink-0 rounded p-1.5 text-text-muted hover:text-text-primary transition-colors"
              title="Camera"
              onClick={() => setCameraOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask about gemstones, faceting, identification..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[24px] max-h-[160px] flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <VoiceInput onTranscript={handleVoiceTranscript} />
            <button
              onClick={handleSend}
              disabled={(!value.trim() && !selectedImage) || isLoading}
              className={cn(
                "shrink-0 rounded-md p-2 transition-all",
                (value.trim() || selectedImage) && !isLoading
                  ? "bg-gemstone-600 text-white hover:bg-gemstone-500"
                  : "text-text-muted"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-text-muted">
            GemSage may produce inaccurate information. Always verify with a certified gemologist.
          </p>
        </div>
      </div>
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
