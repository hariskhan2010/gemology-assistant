"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Square, Volume2, Loader2 } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useChat } from "@/lib/chat-context";

interface VoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceMode({ isOpen, onClose }: VoiceModeProps) {
  const { sendMessage } = useChat();
  const { isListening, transcript, isSupported: sttSupported, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { isSpeaking, isSupported: ttsSupported, speak, stop: stopSpeaking } = useTextToSpeech();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setLastResponse("");
      startListening();
    }
  };

  const handleSendTranscript = async () => {
    if (!transcript.trim()) return;
    stopListening();
    setIsProcessing(true);
    try {
      await sendMessage(transcript.trim());
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  if (!isOpen || !sttSupported) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary">Voice Mode</h2>
          <p className="mt-2 text-sm text-text-secondary">
            {isListening ? "Listening..." : isProcessing ? "Thinking..." : lastResponse ? "Response ready" : "Tap to speak"}
          </p>
        </div>

        {/* Waveform visualization */}
        <div ref={waveRef} className="flex items-center gap-1 h-16">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isListening
                  ? "bg-gemstone-400"
                  : isProcessing
                  ? "bg-sapphire-500 animate-pulse"
                  : "bg-text-muted/30"
              }`}
              style={{
                height: isListening ? `${Math.random() * 48 + 16}px` : isProcessing ? "8px" : "4px",
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="w-full rounded-lg bg-surface p-4 text-center text-sm text-text-secondary">
            {transcript}
          </div>
        )}

        {/* Response */}
        {lastResponse && (
          <div className="w-full rounded-lg bg-surface p-4 text-sm text-text-primary">
            {lastResponse}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="rounded-full p-4 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            onClick={handleToggleListening}
            disabled={isProcessing}
            className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
              isListening
                ? "bg-ruby-500 text-white shadow-lg shadow-ruby-500/30 scale-110"
                : isProcessing
                ? "bg-surface-elevated text-text-muted cursor-wait"
                : "bg-gemstone-600 text-white shadow-lg shadow-gemstone-600/30 hover:bg-gemstone-500"
            }`}
          >
            {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>
          <button
            onClick={isSpeaking ? stopSpeaking : () => speak(lastResponse || transcript)}
            disabled={isProcessing || (!lastResponse && !transcript)}
            className={`rounded-full p-4 transition-colors ${
              isSpeaking ? "text-gemstone-400" : "text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            }`}
          >
            {isSpeaking ? <Square className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </button>
        </div>

        {transcript && !isListening && !isProcessing && (
          <button
            onClick={handleSendTranscript}
            className="rounded-md bg-gemstone-600 px-6 py-2 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors"
          >
            Send & Get Response
          </button>
        )}
      </div>
    </div>
  );
}
