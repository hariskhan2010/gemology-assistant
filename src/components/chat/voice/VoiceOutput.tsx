"use client";

import { Volume2, Square } from "lucide-react";

interface VoiceOutputProps {
  text: string;
}

export function VoiceOutput({ text }: VoiceOutputProps) {
  const { isSpeaking, isSupported, speak, stop } = require("@/hooks/use-text-to-speech").useTextToSpeech();

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isSpeaking ? stop : () => speak(text)}
      className={`rounded p-1 text-text-muted transition-colors ${
        isSpeaking ? "text-gemstone-400" : "hover:text-text-primary"
      }`}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}
