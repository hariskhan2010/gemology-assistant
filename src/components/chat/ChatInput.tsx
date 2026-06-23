"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Paperclip, Camera, Video, X } from "lucide-react";
import { useChat } from "@/lib/chat-context";
import { CameraCapture } from "@/components/chat/media/CameraCapture";
import { VoiceInput } from "@/components/chat/voice/VoiceInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export function ChatInput({ onCameraTalkOpen }: { onCameraTalkOpen?: () => void }) {
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

  const canSend = (value.trim() || selectedImage) && !isLoading;

  return (
    <>
      <div className="border-t border-border bg-background-secondary p-4">
        <div className="mx-auto max-w-3xl">
          {selectedImage && (
            <div className="mb-2 flex items-center gap-2">
              <div className="relative group">
                <img
                  src={selectedImage}
                  alt="Attachment"
                  className="h-16 w-16 rounded-lg object-cover border border-border shadow-sm"
                />
                <button
                  onClick={handleImageClear}
                  className="absolute -top-2 -right-2 rounded-full bg-surface border border-border p-0.5 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-text-muted">Image attached</span>
            </div>
          )}
          <div className={cn(
            "flex items-end gap-2 rounded-xl border bg-surface p-2 transition-all duration-200",
            "focus-within:border-gemstone-500 focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.3)]",
            canSend && "border-gemstone-500/50"
          )}>
            <Tooltip content="Upload image">
              <button
                className="shrink-0 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
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
            </Tooltip>
            <Tooltip content="Take photo">
              <button
                className="shrink-0 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
                title="Camera"
                onClick={() => setCameraOpen(true)}
              >
                <Camera className="h-4 w-4" />
              </button>
            </Tooltip>
            {onCameraTalkOpen && (
              <Tooltip content="Camera Talk (hands-free)">
                <button
                  className="shrink-0 rounded-lg p-1.5 text-text-muted hover:text-gemstone-400 hover:bg-gemstone-600/10 transition-colors"
                  title="Camera Talk"
                  onClick={onCameraTalkOpen}
                >
                  <Video className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask about gemstones, faceting, identification..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[24px] max-h-[160px] flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none px-1 py-1.5"
            />
            <VoiceInput onTranscript={handleVoiceTranscript} />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "shrink-0 rounded-lg p-2 transition-all duration-200",
                canSend
                  ? "bg-gemstone-600 text-white hover:bg-gemstone-500 shadow-sm shadow-gemstone-600/20 hover:shadow-md hover:shadow-gemstone-500/30 hover:-translate-y-0.5"
                  : "text-text-muted"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-text-muted">
            StoneWise may produce inaccurate information. Always verify with a certified gemologist.
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
