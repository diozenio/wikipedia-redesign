"use client";

import { ArrowRight, FileText, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/ui/lib/utils";
import { Kbd } from "@/ui/primitives/kbd";

const SEARCH_RESULTS = [
  {
    title: "Sistema de informação",
    breadcrumb: "Wikipédia › Ciência da computação",
  },
  {
    title: "Sistemas de informação geográfica",
    breadcrumb: "Wikipédia › Geografia",
  },
  { title: "Teoria de sistemas", breadcrumb: "Wikipédia › Filosofia" },
  {
    title: "Sistema operacional",
    breadcrumb: "Wikipédia › Ciência da computação",
  },
];

export function HeaderSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full max-w-120">
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-md border bg-background px-3 shadow-xs transition-colors",
          open ? "border-ring ring-3 ring-ring/50" : "border-input",
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          // biome-ignore lint/a11y/noAutofocus: focuses the field the user just revealed with the search button
          autoFocus={autoFocus}
          aria-label="Pesquisar na Wikipédia"
          placeholder="Pesquisar na Wikipédia"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            aria-label="Limpar pesquisa"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setQuery("")}
            className="flex shrink-0 items-center justify-center rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <Kbd>Ctrl K</Kbd>
        )}
      </div>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 flex w-full flex-col gap-px rounded-lg border border-border bg-background p-1.5 shadow-md ring-1 ring-foreground/10">
          {SEARCH_RESULTS.map((result, index) => (
            <div
              key={result.title}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2",
                index === 0 && "bg-accent",
              )}
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-px">
                <span className="text-sm font-medium text-foreground">
                  {result.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.breadcrumb}
                </span>
              </div>
            </div>
          ))}
          <div className="py-1">
            <div className="h-px w-full bg-border" />
          </div>
          <div className="flex items-center justify-between rounded-md px-2.5 py-2">
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-foreground" />
              <span className="text-[0.8125rem] font-medium text-foreground">
                Ver todos os resultados
              </span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
