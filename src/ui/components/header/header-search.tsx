"use client";

import { FileText, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";
import { useArticleSearch } from "@/ui/lib/use-article-search";
import { cn } from "@/ui/lib/utils";
import { Kbd } from "@/ui/primitives/kbd";

export function HeaderSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { status, results } = useArticleSearch(query);

  const open = focused && query.trim().length > 0;
  const activeResult = results[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openArticle = (article: ArticleSummaryData) => {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/articles/${encodeURIComponent(article.slug)}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        if (results.length === 0) return;
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % results.length);
        return;
      case "ArrowUp":
        if (results.length === 0) return;
        event.preventDefault();
        setActiveIndex((index) =>
          index <= 0 ? results.length - 1 : index - 1,
        );
        return;
      case "Enter": {
        const target = activeResult ?? results[0];
        if (!target) return;
        event.preventDefault();
        openArticle(target);
        return;
      }
      case "Escape":
        if (query) setQuery("");
        else inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-120">
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-md border bg-background px-3 shadow-xs transition-colors",
          focused ? "border-ring ring-3 ring-ring/50" : "border-input",
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeResult ? `${listboxId}-${activeResult.id}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          // biome-ignore lint/a11y/noAutofocus: focuses the field the user just revealed with the search button
          autoFocus={autoFocus}
          aria-label="Pesquisar na Wikipédia"
          placeholder="Pesquisar na Wikipédia"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {status === "loading" && (
          <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
        )}
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
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 flex w-full flex-col rounded-lg border border-border bg-background p-1.5 shadow-md ring-1 ring-foreground/10">
          <div
            id={listboxId}
            role="listbox"
            aria-label="Sugestões de artigos"
            className="flex flex-col gap-px"
          >
            {results.map((result, index) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled by the combobox input through aria-activedescendant
              <div
                key={result.id}
                id={`${listboxId}-${result.id}`}
                role="option"
                tabIndex={-1}
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openArticle(result)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2",
                  index === activeIndex && "bg-accent",
                )}
              >
                <SearchResultThumbnail result={result} />
                <div className="flex min-w-0 flex-col gap-px">
                  <span className="truncate text-sm font-medium text-foreground">
                    {result.title}
                  </span>
                  {result.description && (
                    <span className="truncate text-xs text-muted-foreground">
                      {result.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <p
              aria-live="polite"
              className="px-2.5 py-2 text-sm text-muted-foreground"
            >
              {status === "error"
                ? "Não foi possível pesquisar agora."
                : status === "ready"
                  ? `Nenhum artigo encontrado para “${query.trim()}”.`
                  : "Pesquisando…"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultThumbnail({ result }: { result: ArticleSummaryData }) {
  if (!result.thumbnail) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <FileText className="size-4 text-muted-foreground" />
      </span>
    );
  }

  return (
    <Image
      src={result.thumbnail.src}
      alt=""
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-md bg-muted object-cover"
    />
  );
}
