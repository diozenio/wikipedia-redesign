"use client";

import { Dialog } from "@base-ui/react/dialog";
import { XIcon, ZoomInIcon } from "lucide-react";
import { useState } from "react";
import {
  ImageFallback,
  useImageLoadFailure,
} from "@/ui/components/image/image-with-fallback";
import { cn, focusRing } from "@/ui/lib/utils";

export function RichTextImage({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  const [open, setOpen] = useState(false);
  const image = useImageLoadFailure(src);

  return (
    <figure className="mx-auto flex w-fit max-w-full flex-col gap-2">
      {image.failed ? (
        <ImageFallback alt={alt} width={width} height={height} />
      ) : (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label={alt ? `Ampliar imagem: ${alt}` : "Ampliar imagem"}
            className={cn(
              "group relative mx-auto block max-w-full cursor-zoom-in rounded-md",
              focusRing,
            )}
          >
            {/* biome-ignore lint/performance/noImgElement: Wikimedia thumbnails are already resized and served from their CDN */}
            <img
              ref={image.ref}
              src={src}
              alt={alt}
              onError={image.onError}
              width={width || undefined}
              height={height || undefined}
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto max-h-[32rem] w-auto max-w-full rounded-md border border-border bg-muted/30 object-contain"
            />
            <span
              aria-hidden
              className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <ZoomInIcon className="size-3.5" />
              Ampliar
            </span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/85 transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
            <Dialog.Popup
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
              className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-3 p-4 outline-none transition-[opacity,scale] duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none"
            >
              <Dialog.Title className="sr-only">{caption || alt}</Dialog.Title>
              <Dialog.Close
                className={cn(
                  "absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20",
                  focusRing,
                )}
              >
                <XIcon className="size-4" />
                Fechar
              </Dialog.Close>
              {/* biome-ignore lint/performance/noImgElement: Wikimedia thumbnails are already resized and served from their CDN */}
              <img
                src={src}
                alt={alt}
                className="max-h-[calc(100dvh-8rem)] max-w-full rounded-md object-contain"
              />
              {caption && (
                <Dialog.Description className="max-w-prose text-center text-sm text-white/90">
                  {caption}
                </Dialog.Description>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      {caption && (
        <figcaption className="mx-auto max-w-prose text-center text-sm leading-snug text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
