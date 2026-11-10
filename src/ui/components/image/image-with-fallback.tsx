"use client";

import { ImageOffIcon } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { cn } from "@/ui/lib/utils";

/**
 * Tracks whether an image failed to load. Besides `onError`, it checks the
 * element on mount: an image may have failed before hydration (SSR'd or
 * cached error), when React's handler was not attached yet.
 */
export function useImageLoadFailure(src: string) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = ref.current;
    if (image?.complete && image.naturalWidth === 0) setFailedSrc(src);
  }, [src]);

  return {
    ref,
    failed: failedSrc === src,
    onError: () => setFailedSrc(src),
  };
}

export function ImageFallback({
  alt,
  width,
  height,
  className,
}: {
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt ? `Imagem indisponível: ${alt}` : "Imagem indisponível"}
      style={{
        width: `${width || 480}px`,
        aspectRatio: width && height ? `${width} / ${height}` : "16 / 9",
      }}
      className={cn(
        "mx-auto flex max-h-[32rem] max-w-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted p-4 text-center text-muted-foreground",
        className,
      )}
    >
      <ImageOffIcon aria-hidden className="size-6 shrink-0" />
      <span className="text-sm font-medium">Imagem indisponível</span>
    </div>
  );
}

type ImageWithFallbackProps = Omit<
  ComponentProps<"img">,
  "src" | "alt" | "width" | "height" | "ref" | "onError"
> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackClassName?: string;
};

/**
 * `<img>` that turns into the designed "Imagem indisponível" placeholder when
 * it cannot be loaded, keeping its accessible description.
 */
export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const { ref, failed, onError } = useImageLoadFailure(src);

  if (failed) {
    return (
      <ImageFallback
        alt={alt}
        width={width}
        height={height}
        className={fallbackClassName}
      />
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: Wikimedia thumbnails are already resized and served from their CDN
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width || undefined}
      height={height || undefined}
      onError={onError}
      {...props}
    />
  );
}
