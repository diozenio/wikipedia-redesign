import { BookOpen, Ellipsis, History, Star } from "lucide-react";
import { cn, focusRing } from "@/ui/lib/utils";
import { Separator } from "@/ui/primitives/separator";

export function ArticleToolbar() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-0.5 rounded-md bg-muted p-0.75">
        <button
          type="button"
          aria-pressed="true"
          className={cn(
            "rounded-[calc(var(--radius-md)-2px)] bg-background px-3.5 py-1.5 text-sm font-medium text-foreground shadow-xs",
            focusRing,
          )}
        >
          Artigo
        </button>
        <button
          type="button"
          aria-pressed="false"
          className={cn(
            "rounded-[calc(var(--radius-md)-2px)] px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground",
            focusRing,
          )}
        >
          Discussão
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-pressed="true"
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground",
            focusRing,
          )}
        >
          <BookOpen className="size-4" />
          Ler
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted",
            focusRing,
          )}
        >
          <History className="size-4" />
          Ver histórico
        </button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <button
          type="button"
          aria-label="Favoritar artigo"
          aria-pressed="false"
          className={cn(
            "flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted",
            focusRing,
          )}
        >
          <Star className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Mais opções"
          className={cn(
            "flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted",
            focusRing,
          )}
        >
          <Ellipsis className="size-4" />
        </button>
      </div>
    </div>
  );
}
