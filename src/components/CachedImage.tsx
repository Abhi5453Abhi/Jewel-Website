"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCachedImage } from "@/lib/imageCache";

interface CachedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function CachedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  onLoad,
  onError,
}: CachedImageProps) {
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // If it's a base64 data URL, use it directly
    if (src && src.startsWith("data:image")) {
      setCachedSrc(src);
      setIsLoading(false);
      return;
    }

    // Only cache external URLs, not local paths
    if (src && !src.startsWith("/") && !src.startsWith("data:")) {
      getCachedImage(src)
        .then((cached) => {
          if (isMounted) {
            setCachedSrc(cached);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error loading cached image:", err);
          if (isMounted) {
            setError(true);
            setIsLoading(false);
          }
        });
    } else {
      setCachedSrc(src);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className || ""}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-neutral text-sm">Failed to load image</span>
      </div>
    );
  }

  // Use regular img tag for base64 data URLs (Next.js Image doesn't handle them well)
  if (cachedSrc.startsWith("data:image")) {
    const imgProps = {
      src: cachedSrc,
      alt,
      className: `${className || ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`,
      onLoad: () => {
        setIsLoading(false);
        onLoad?.();
      },
      onError: () => {
        setError(true);
        setIsLoading(false);
        onError?.();
      },
    };

    if (fill) {
      return (
        <img
          {...imgProps}
          className={`${imgProps.className} w-full h-full object-cover`}
          style={{ position: "absolute", inset: 0 }}
        />
      );
    }

    return (
      <img
        {...imgProps}
        width={width}
        height={height}
        className={`${imgProps.className} object-cover`}
      />
    );
  }

  // Use Next.js Image for regular URLs
  const imageProps = {
    src: cachedSrc,
    alt,
    className: `${className || ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`,
    sizes,
    priority,
    onLoad: () => {
      setIsLoading(false);
      onLoad?.();
    },
    onError: () => {
      setError(true);
      setIsLoading(false);
      onError?.();
    },
  };

  if (fill) {
    return <Image {...imageProps} fill unoptimized />;
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      unoptimized
    />
  );
}

