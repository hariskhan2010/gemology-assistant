"use client";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechToText();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
      resetTranscript();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative shrink-0 rounded p-1.5 transition-colors ${
        isListening
          ? "text-ruby-500 animate-pulse"
          : "text-text-muted hover:text-text-primary"
      }`}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {isListening && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ruby-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ruby-500" />
        </span>
      )}
    </button>
  );
}
