"use client";

import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { useArticle } from "@/ui/contexts/article-context";

export function ArticleBreadcrumb() {
  const { breadcrumb } = useArticle();

  return (
    <div className="flex items-center gap-2">
      {breadcrumb.map((item, index) => {
        const isLast = index === breadcrumb.length - 1;
        return (
          <Fragment key={item.label}>
            {index > 0 && (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            <span
              className={
                isLast
                  ? "text-sm font-medium text-foreground"
                  : "text-sm text-muted-foreground"
              }
            >
              {item.label}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
