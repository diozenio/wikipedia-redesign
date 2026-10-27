import { BookOpen, Ellipsis, History, Star } from "lucide-react";
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
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground">
          <BookOpen className="size-4" />
          Ler
        </div>
        <div className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground">
          <History className="size-4" />
          Ver histórico
        </div>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <button
          type="button"
          aria-label="Favoritar artigo"
          className="flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
        >
          <Star className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Mais opções"
          className="flex size-7 items-center justify-center rounded-md text-foreground hover:bg-muted"
        >
          <Ellipsis className="size-4" />
        </button>
      </div>
    </div>
  );
}
