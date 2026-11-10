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
  return (
    <figure className="ml-auto flex w-55 max-w-full flex-col gap-1.5 rounded-sm border border-border bg-muted/30 p-1.5">
      {/* biome-ignore lint/performance/noImgElement: Wikimedia thumbnails are already resized and served from their CDN */}
      <img
        src={src}
        alt={alt}
        width={width || undefined}
        height={height || undefined}
        loading="lazy"
        decoding="async"
        className="h-auto w-full max-w-full rounded-[2px] object-cover"
      />
      {caption && (
        <figcaption className="text-xs leading-snug text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
