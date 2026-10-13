import Image from "next/image";

export function RichTextImage({
  src,
  caption,
  width,
  height,
}: {
  src: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="ml-auto flex w-[220px] flex-col gap-1.5 rounded-sm border border-border bg-muted/30 p-1.5">
      <Image
        src={src}
        alt={caption}
        width={width}
        height={height}
        className="w-full rounded-[2px] object-cover"
      />
      <figcaption className="text-xs leading-snug text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
