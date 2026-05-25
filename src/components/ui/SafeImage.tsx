"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function SafeImage({ src, alt, className = "", containerClassName = "" }: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const isDataUri = src.startsWith("data:");

  if (isDataUri || useFallback) {
    return (
      <div className={containerClassName}>
        <img src={src} alt={alt} className={className} loading="lazy" />
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain ${className}`}
        loading="lazy"
        onError={() => setUseFallback(true)}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}
