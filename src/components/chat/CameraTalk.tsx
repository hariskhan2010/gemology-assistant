"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Mic, MicOff, Volume2, VolumeX, X, Loader2, MessageSquare } from "lucide-react";
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
  const silenceTimerRef = useRef<number | null>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isAutoMode, setIsAutoMode] = useState(true);
  
  const prevMessageCountRef = useRef(0);
  const finalTranscriptRef = useRef("");
  const isProcessingRef = useRef(false);

  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += text;
        else interim += text;
      }

      if (final) finalTranscriptRef.current += final + " ";
      setTranscript(final || interim);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      if (!isProcessingRef.current) {
        silenceTimerRef.current = window.setTimeout(() => {
          if (finalTranscriptRef.current.trim() && isAutoMode && !isProcessingRef.current) {
            handleProcessInput();
          }
        }, 1500);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isAutoMode && !isProcessingRef.current && isOpen) {
        setTimeout(() => {
          if (!isProcessingRef.current && isOpen) startListening();
        }, 500);
      }
    };

    recognition.onerror = () => setIsListening(false);
    return recognition;
  }, [isAutoMode, isOpen]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("Unable to access camera. Please grant permission.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraStream(null);
  }, []);

  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopCamera]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) recognitionRef.current = initSpeechRecognition();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {}
    }
  }, [initSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isAutoMode && isOpen) {
        setTimeout(() => {
          if (isAutoMode && isOpen) {
            finalTranscriptRef.current = "";
            setTranscript("");
            startListening();
          }
        }, 300);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isAutoMode, isOpen, startListening]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, []);

  const handleProcessInput = useCallback(async () => {
    const text = finalTranscriptRef.current.trim();
    if (!text && !cameraStream) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    stopListening();
    setIsProcessing(true);
    isProcessingRef.current = true;
    setLastResponse("");

    try {
      const frame = captureFrame();
      await sendMessage(text || "What do you see?", frame || undefined);
    } catch (err) {
      console.error("Camera talk error:", err);
      setLastResponse("Sorry, I encountered an error.");
      setIsProcessing(false);
      isProcessingRef.current = false;
      if (isAutoMode) setTimeout(() => startListening(), 1000);
    }
  }, [captureFrame, sendMessage, stopListening, isAutoMode, startListening, cameraStream]);

  useEffect(() => {
    if (isOpen && isCameraOn) {
      startCamera();
      prevMessageCountRef.current = activeConversation?.messages.length || 0;
      recognitionRef.current = initSpeechRecognition();
      if (isAutoMode) setTimeout(() => startListening(), 1000);
    }

    return () => {
      if (!isOpen) {
        stopCamera();
        stopListening();
        stopSpeaking();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isOpen, isCameraOn, startCamera, initSpeechRecognition, isAutoMode, startListening, stopCamera, stopListening, stopSpeaking]);

  useEffect(() => {
    if (!activeConversation || !isProcessingRef.current) return;
    const currentCount = activeConversation.messages.length;
    if (currentCount > prevMessageCountRef.current) {
      const newMsg = activeConversation.messages.slice(prevMessageCountRef.current).find((m: any) => m.role === "assistant");
      if (newMsg) {
        setLastResponse(newMsg.content);
        speak(newMsg.content);
        setIsProcessing(false);
        isProcessingRef.current = false;
      }
    }
    prevMessageCountRef.current = currentCount;
  }, [activeConversation?.messages.length, speak]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      stopListening();
      stopSpeaking();
      setIsProcessing(false);
      isProcessingRef.current = false;
      setLastResponse("");
      setTranscript("");
      finalTranscriptRef.current = "";
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, [isOpen, stopCamera, stopListening, stopSpeaking]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-surface">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 text-gemstone-400" />
          <h2 className="font-heading text-lg font-semibold text-text-primary">Camera Talk</h2>
          {isAutoMode && (
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">Auto</span>
          )}
        </div>
        <button onClick={onClose} className="rounded-full p-2 text-text-muted hover:text-text-primary hover:bg-surface transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-black/50 p-4">
        {cameraError ? (
          <div className="text-center p-8">
            <p className="text-ruby-400 mb-4">{cameraError}</p>
            <button onClick={startCamera} className="rounded-md bg-gemstone-600 px-4 py-2 text-sm text-white hover:bg-gemstone-500">
              Retry Camera
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-text-muted">Camera is off</p>
              </div>
            )}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-12 w-12 animate-spin text-gemstone-400" />
              </div>
            )}
            {isListening && !isProcessing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-white">Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
                <Volume2 className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span className="text-xs text-white">Speaking...</span>
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {(transcript || lastResponse) && (
        <div className="px-4 py-3 border-t border-surface bg-surface/50 max-h-32 overflow-y-auto">
          {transcript && isListening && (
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

      <div className="p-6 border-t border-surface">
        <div className="flex items-center justify-center gap-6">
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
            className={`rounded-full p-4 transition-colors ${isCameraOn ? "bg-surface text-text-primary" : "bg-surface-elevated text-text-muted"}`}
          >
            <Camera className="h-5 w-5" />
          </button>

          {isCameraOn && (
            <button onClick={toggleCamera} className="rounded-full p-3 text-text-muted hover:text-text-primary transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 16V7a2 2 0 0 0-2-2h-3l-2-2H9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2z" />
                <circle cx="12" cy="11" r="3" />
                <path d="M8 16l-2 4" />
                <path d="M16 16l2 4" />
              </svg>
            </button>
          )}

          <button
            onClick={() => {
              if (isAutoMode) {
                setIsAutoMode(false);
                stopListening();
              } else {
                isListening ? stopListening() : startListening();
              }
            }}
            disabled={isProcessing}
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
              isListening ? "bg-ruby-500 text-white shadow-lg shadow-ruby-500/30 scale-110 animate-pulse" : 
              isProcessing ? "bg-surface-elevated text-text-muted cursor-wait" : 
              isAutoMode ? "bg-gemstone-600/50 text-white" : 
              "bg-gemstone-600 text-white shadow-lg shadow-gemstone-600/30 hover:bg-gemstone-500"
            }`}
          >
            {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>

          <button
            onClick={() => {
              const newAuto = !isAutoMode;
              setIsAutoMode(newAuto);
              if (newAuto && !isListening && !isProcessing) {
                finalTranscriptRef.current = "";
                setTranscript("");
                startListening();
              } else if (!newAuto) {
                stopListening();
              }
            }}
            className={`rounded-full p-4 transition-colors ${isAutoMode ? "bg-emerald-500/20 text-emerald-400" : "bg-surface text-text-muted hover:text-text-primary"}`}
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          <button onClick={stopSpeaking} className={`rounded-full p-4 transition-colors ${isSpeaking ? "bg-gemstone-500/20 text-gemstone-400" : "bg-surface text-text-muted hover:text-text-primary"}`}>
            {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          {isListening ? "Listening... (auto-stops after 1.5s silence)" : 
           isProcessing ? "Processing..." : 
           isSpeaking ? "Speaking..." : 
           isAutoMode ? "Auto mode: Just start talking!" : 
           "Tap mic to talk"}
        </p>
      </div>
    </div>
  );
}
