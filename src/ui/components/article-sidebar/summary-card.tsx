"use client";

import { Info } from "lucide-react";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { ImageWithFallback } from "@/ui/components/image/image-with-fallback";
import { useArticle } from "@/ui/contexts/article-context";

export function SummaryCard() {
  const { infobox } = useArticle();

  if (!infobox || (infobox.rows.length === 0 && !infobox.image)) return null;

  return (
    <SidebarCard icon={Info} title={infobox.caption ?? "Resumo rápido"}>
      {infobox.image && (
        <figure className="flex flex-col gap-1.5 px-5 pb-3">
          <ImageWithFallback
            src={infobox.image.src}
            alt={infobox.image.alt}
            width={infobox.image.width}
            height={infobox.image.height}
            loading="lazy"
            decoding="async"
            className="mx-auto h-auto max-w-full rounded-sm"
          />
          {infobox.image.caption && (
            <figcaption className="text-center text-xs leading-snug text-muted-foreground">
              {infobox.image.caption}
            </figcaption>
          )}
        </figure>
      )}
      {infobox.rows.length > 0 && (
        <dl className="flex flex-col px-5 pb-4">
          {infobox.rows.map((row, index) => (
            <div
              key={`${index}-${row.label}`}
              className="flex flex-col gap-0.5 border-t border-border py-2.5"
            >
              <dt className="text-xs font-medium text-muted-foreground">
                {row.label}
              </dt>
              <dd className="text-sm leading-[1.4] break-words text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </SidebarCard>
  );
}
