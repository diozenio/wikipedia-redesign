"use client";

import { ChevronRight } from "lucide-react";
import { useArticle } from "@/ui/contexts/article-context";

export function ArticleBreadcrumb() {
  const { breadcrumb } = useArticle();

  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex items-center gap-2">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              )}
              <span
                aria-current={isLast ? "page" : undefined}
                className={
                  isLast
                    ? "text-sm font-medium text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
