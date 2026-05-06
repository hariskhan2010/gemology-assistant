"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Mic, MicOff, Volume2, VolumeX, X, Loader2 } from "lucide-react";
import { useChat } from "@/lib/chat-context";

interface CameraTalkProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraTalk({ isOpen, onClose }: CameraTalkProps) {
  const { sendMessage, activeConversation } = useChat();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const prevMessageCountRef = useRef(0);
  const finalTranscriptRef = useRef("");

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = final || finalTranscriptRef.current;
      setTranscript(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    return recognition;
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError("Unable to access camera. Please grant permission.");
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraStream(null);
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [stopCamera]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }
    if (recognitionRef.current) {
      finalTranscriptRef.current = "";
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
      }
    }
  }, [initSpeechRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
      setIsListening(false);
    }
  }, []);

  // Speak text using Web Speech API
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Google")
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Initialize camera when opened
  useEffect(() => {
    if (isOpen && isCameraOn) {
      startCamera();
      prevMessageCountRef.current = activeConversation?.messages.length || 0;
    }
    return () => {
      if (!isOpen) {
        stopCamera();
        stopListening();
        stopSpeaking();
      }
    };
  }, [isOpen, isCameraOn, startCamera, stopCamera, stopListening, stopSpeaking, activeConversation?.messages.length]);

  // Re-start camera when facing mode changes
  useEffect(() => {
    if (isOpen && isCameraOn && cameraStream) {
      startCamera();
    }
  }, [facingMode]);

  // Watch for new assistant messages and speak them
  useEffect(() => {
    if (!activeConversation || !isProcessing) return;

    const currentCount = activeConversation.messages.length;
    if (currentCount > prevMessageCountRef.current) {
      const newMessages = activeConversation.messages.slice(prevMessageCountRef.current);
      const assistantMsg = newMessages.find((m) => m.role === "assistant");
      if (assistantMsg) {
        setLastResponse(assistantMsg.content);
        speak(assistantMsg.content);
        setIsProcessing(false);
        setTranscript("");
        finalTranscriptRef.current = "";
      }
    }
    prevMessageCountRef.current = currentCount;
  }, [activeConversation?.messages.length, isProcessing, speak]);

  // Capture frame from video as base64
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, []);

  // Process voice + camera frame
  const handleProcessInput = async () => {
    const currentTranscript = finalTranscriptRef.current || transcript;
    if (!currentTranscript.trim() && !cameraStream) return;

    stopListening();
    setIsProcessing(true);
    setLastResponse("");

    try {
      const imageFrame = captureFrame();
      const userMessage = currentTranscript.trim() || "What do you see?";

      await sendMessage(userMessage, imageFrame || undefined);
    } catch (err) {
      console.error("Camera talk error:", err);
      setLastResponse("Sorry, I encountered an error processing your request.");
      setIsProcessing(false);
    }
  }, [transcript, cameraStream, captureFrame, sendMessage, stopListening]);

  // Auto-process when user stops speaking
  useEffect(() => {
    if (!isListening && (finalTranscriptRef.current || transcript) && !isProcessing) {
      const timer = setTimeout(() => {
        handleProcessInput();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, isProcessing, handleProcessInput]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      stopListening();
      stopSpeaking();
      setIsProcessing(false);
      setLastResponse("");
      setTranscript("");
      finalTranscriptRef.current = "";
    }
  }, [isOpen, stopCamera, stopListening, stopSpeaking]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 text-gemstone-400" />
          <h2 className="font-heading text-lg font-semibold text-text-primary">Camera Talk</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-black/50 p-4">
        {cameraError ? (
          <div className="text-center p-8">
            <p className="text-ruby-400 mb-4">{cameraError}</p>
            <button
              onClick={startCamera}
              className="rounded-md bg-gemstone-600 px-4 py-2 text-sm text-white hover:bg-gemstone-500"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {/* Camera off overlay */}
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-text-muted">Camera is off</p>
              </div>
            )}

            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-12 w-12 animate-spin text-gemstone-400" />
              </div>
            )}
          </div>
        )}

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Transcript Display */}
      {(transcript || lastResponse) && (
        <div className="px-4 py-3 border-t border-surface bg-surface/50">
          {transcript && (
            <div className="text-center text-sm text-text-secondary mb-2">
              <span className="font-medium text-gemstone-400">You:</span> {transcript}
            </div>
          )}
          {lastResponse && (
            <div className="text-center text-sm text-text-primary">
              <span className="font-medium text-emerald-400">GemSage:</span> {lastResponse}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="p-6 border-t border-surface">
        <div className="flex items-center justify-center gap-6">
          {/* Camera toggle */}
          <button
            onClick={() => {
              if (isCameraOn) {
                stopCamera();
                setIsCameraOn(false);
              } else {
                setIsCameraOn(true);
                startCamera();
              }
            }}
            className={`rounded-full p-4 transition-colors ${
              isCameraOn
                ? "bg-surface text-text-primary"
                : "bg-surface-elevated text-text-muted"
            }`}
          >
            <Camera className="h-5 w-5" />
          </button>

          {/* Switch camera */}
          {isCameraOn && (
            <button
              onClick={toggleCamera}
              className="rounded-full p-3 text-text-muted hover:text-text-primary transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 16V7a2 2 0 0 0-2-2h-3l-2-2H9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2z" />
                <circle cx="12" cy="11" r="3" />
                <path d="M8 16l-2 4" />
                <path d="M16 16l2 4" />
              </svg>
            </button>
          )}

          {/* Microphone */}
          <button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            disabled={isProcessing}
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
              isListening
                ? "bg-ruby-500 text-white shadow-lg shadow-ruby-500/30 scale-110 animate-pulse"
                : isProcessing
                ? "bg-surface-elevated text-text-muted cursor-wait"
                : "bg-gemstone-600 text-white shadow-lg shadow-gemstone-600/30 hover:bg-gemstone-500"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>

          {/* Voice output toggle */}
          <button
            onClick={stopSpeaking}
            className={`rounded-full p-4 transition-colors ${
              isSpeaking
                ? "bg-gemstone-500/20 text-gemstone-400"
                : "bg-surface text-text-muted hover:text-text-primary"
            }`}
          >
            {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          {/* Manual send button */}
          {transcript && !isListening && (
            <button
              onClick={handleProcessInput}
              disabled={isProcessing}
              className="rounded-md bg-gemstone-600 px-6 py-3 text-sm font-medium text-white hover:bg-gemstone-500 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          )}
        </div>

        {/* Status text */}
        <p className="mt-4 text-center text-xs text-text-muted">
          {isListening
            ? "Listening... Speak now"
            : isProcessing
            ? "Processing..."
            : lastResponse
            ? "Response complete"
            : "Tap the microphone and speak"}
        </p>
      </div>
    </div>
  );
}
