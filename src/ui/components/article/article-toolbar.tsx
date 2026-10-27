"use client";

import { Ellipsis, History, Star } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { ArticleReadButton } from "@/ui/components/article/article-read-button";
import { Separator } from "@/ui/primitives/separator";

export function ArticleToolbar() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-0.5 rounded-md bg-muted p-0.75">
        <div className="rounded-[calc(var(--radius-md)-2px)] bg-background px-3.5 py-1.5 text-sm font-medium text-foreground shadow-xs">
          Artigo
        </div>
        <div className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
          Discussão
        </div>
      </div>
      <LayoutGroup>
        <div className="flex flex-wrap items-center gap-1">
          <ArticleReadButton />
          <motion.div
            layout
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground"
          >
            <History className="size-4" />
            Ver histórico
          </motion.div>
          <motion.div layout className="flex items-center">
            <Separator orientation="vertical" className="mx-1 h-5" />
          </motion.div>
          <motion.button
            layout
            type="button"
            aria-label="Favoritar artigo"
            className="flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            <Star className="size-4" />
          </motion.button>
          <motion.button
            layout
            type="button"
            aria-label="Mais opções"
            className="flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            <Ellipsis className="size-4" />
          </motion.button>
        </div>
      </LayoutGroup>
    </div>
  );
}
