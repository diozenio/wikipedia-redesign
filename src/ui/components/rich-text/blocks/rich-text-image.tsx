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
    <figure className="mx-auto flex w-fit max-w-full flex-col gap-2">
      {/* biome-ignore lint/performance/noImgElement: Wikimedia thumbnails are already resized and served from their CDN */}
      <img
        src={src}
        alt={alt}
        width={width || undefined}
        height={height || undefined}
        loading="lazy"
        decoding="async"
        className="mx-auto h-auto max-h-[32rem] w-auto max-w-full rounded-md border border-border bg-muted/30 object-contain"
      />
      {caption && (
        <figcaption className="max-w-prose text-sm leading-snug text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
