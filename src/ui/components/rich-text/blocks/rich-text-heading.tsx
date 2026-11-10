import { cn, focusRing } from "@/ui/lib/utils";

export function RichTextHeading({
  id,
  text,
  level = 3,
}: {
  id: string;
  text: string;
  level?: 3 | 4;
}) {
  const Heading = level === 4 ? "h4" : "h3";

  return (
    <Heading
      id={id}
      className={cn(
        "scroll-mt-8 rounded-sm font-semibold tracking-[-0.011em] text-foreground",
        level === 4 ? "text-base" : "text-lg",
        focusRing,
      )}
    >
      {text}
    </Heading>
  );
}
