"use client";

import type { RichTextReference } from "@/ui/components/rich-text/types";
import { useAppearance } from "@/ui/contexts/appearance-context";
import { cn, focusRing } from "@/ui/lib/utils";

export function RichTextReferences({ items }: { items: RichTextReference[] }) {
  const { appearance } = useAppearance();
  // Without inline markers there is no #ref-N anchor to go back to.
  const showBacklinks = appearance.footnoteMarkers;

  return (
    <ol className="flex flex-col gap-2 pl-7 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
      {items.map((item) => (
        <li
          key={item.id}
          id={item.id}
          value={item.number}
          className="list-decimal scroll-mt-8 pl-1 break-words"
        >
          {item.text}
          {showBacklinks && item.backlinkId && (
            <>
              {" "}
              <a
                href={`#${item.backlinkId}`}
                className={cn(
                  "rounded-sm text-xs font-medium whitespace-nowrap text-foreground underline underline-offset-2",
                  focusRing,
                )}
              >
                <span aria-hidden="true">↑ </span>
                Voltar ao texto
                <span className="sr-only">
                  {" "}
                  (voltar à chamada da nota {item.number})
                </span>
              </a>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
