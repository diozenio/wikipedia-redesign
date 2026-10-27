"use client";

import { Calendar, Eye, Languages } from "lucide-react";
import { useArticle } from "@/ui/contexts/article-context";

export function ArticleHeader() {
  const { title, origin, badges, meta } = useArticle();

  return (
    <div className="flex w-full flex-col gap-3 pt-4">
      <h1 className="text-[2rem] leading-tight font-semibold tracking-[-0.027em] text-foreground @min-[40rem]/page:text-[2.75rem]">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{origin}</p>
      <div className="flex flex-wrap items-center gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {badge}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <Languages className="size-3.5" />
          {meta.languages} idiomas
        </span>
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <Calendar className="size-3.5" />
          {meta.lastEditedLabel}
        </span>
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <Eye className="size-3.5" />
          {meta.watchersLabel}
        </span>
      </div>
    </div>
  );
}
