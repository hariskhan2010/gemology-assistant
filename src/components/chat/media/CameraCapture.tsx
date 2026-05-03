"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, SwitchCamera, X, Check } from "lucide-react";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Unable to access camera. Please grant permission.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => { stopCamera(); };
  }, [isOpen, startCamera, stopCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(base64);
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-surface p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-text-primary">Capture Gem Photo</h3>
          <button onClick={onClose} className="rounded p-1.5 text-text-muted hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <p className="text-sm text-text-secondary">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleCamera}
            className="rounded-full p-3 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Switch camera"
          >
            <SwitchCamera className="h-5 w-5" />
          </button>
          <button
            onClick={handleCapture}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gemstone-600 text-white hover:bg-gemstone-500 transition-colors"
            aria-label="Capture photo"
          >
            <Camera className="h-6 w-6" />
          </button>
          <div className="w-11" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
