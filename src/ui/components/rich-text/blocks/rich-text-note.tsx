import { cn, focusRing } from "@/ui/lib/utils";

export function RichTextNote({
  id,
  number,
  targetId,
}: {
  id: string;
  number: number;
  targetId: string;
}) {
  return (
    <sup className="leading-none">
      <a
        id={id}
        href={`#${targetId}`}
        aria-label={`Nota ${number}`}
        className={cn(
          "scroll-mt-24 rounded-sm px-px text-[0.75em] font-medium text-foreground underline underline-offset-2",
          focusRing,
        )}
      >
        [{number}]
      </a>
    </sup>
  );
}
