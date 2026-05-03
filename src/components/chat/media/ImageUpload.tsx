"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (base64: string, fileName: string) => void;
  onClear: () => void;
  selectedImage: string | null;
}

export function ImageUpload({ onImageSelect, onClear, selectedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result, file.name);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (selectedImage) {
    return (
      <div className="relative group">
        <img
          src={selectedImage}
          alt="Selected"
          className="h-20 w-20 rounded-lg object-cover border border-border"
        />
        <button
          onClick={onClear}
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated text-text-muted hover:text-text-primary border border-border transition-colors"
          aria-label="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-dashed p-2 transition-colors cursor-pointer",
        isDragging
          ? "border-gemstone-500 bg-gemstone-500/10"
          : "border-border hover:border-gemstone-500/50"
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <Upload className="h-4 w-4 text-text-muted" />
      <span className="text-xs text-text-muted">Upload</span>
    </div>
  );
}
