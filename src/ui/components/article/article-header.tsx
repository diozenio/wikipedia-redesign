"use client";

import { Calendar, Eye, Languages } from "lucide-react";
import { useArticle } from "@/ui/contexts/article-context";

export const ARTICLE_TITLE_ID = "titulo-do-artigo";

export function ArticleHeader() {
  const { title, origin, badges, meta } = useArticle();

  return (
    <header className="flex w-full flex-col gap-3 pt-4">
      <h1
        id={ARTICLE_TITLE_ID}
        className="text-[44px] leading-tight font-semibold tracking-[-1.2px] text-foreground"
      >
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{origin}</p>
      <ul aria-label="Selos do artigo" className="flex items-center gap-2">
        {badges.map((badge) => (
          <li
            key={badge}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {badge}
          </li>
        ))}
      </ul>
      <ul
        aria-label="Informações do artigo"
        className="flex items-center gap-4"
      >
        <li className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Languages className="size-3.5" />
          {meta.languages} idiomas
        </li>
        <li className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Calendar className="size-3.5" />
          {meta.lastEditedLabel}
        </li>
        <li className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Eye className="size-3.5" />
          {meta.watchersLabel}
        </li>
      </ul>
    </header>
  );
}
