"use client";

import { FileText, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";
import { useArticleSearch } from "@/ui/lib/use-article-search";
import { cn, focusRing } from "@/ui/lib/utils";
import { Kbd } from "@/ui/primitives/kbd";

export function HeaderSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const id = useId();
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { status, results } = useArticleSearch(query);

  const term = query.trim();
  const open = focused && term.length > 0 && !dismissed;
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
    setActiveIndex(-1);
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/articles/${encodeURIComponent(article.slug)}`);
  };

  const showList = (index: number) => {
    if (!term) return;
    setDismissed(false);
    setActiveIndex(results.length > 0 ? index : -1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) showList(0);
        else if (results.length > 0)
          setActiveIndex((index) => (index + 1) % results.length);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) showList(results.length - 1);
        else if (results.length > 0)
          setActiveIndex((index) =>
            index <= 0 ? results.length - 1 : index - 1,
          );
        return;
      case "Home":
        if (!open || results.length === 0) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        if (!open || results.length === 0) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      case "Escape":
        event.preventDefault();
        if (open) {
          setDismissed(true);
          setActiveIndex(-1);
        } else if (query) {
          setQuery("");
          setActiveIndex(-1);
        } else {
          inputRef.current?.blur();
        }
    }
  };

  const emptyMessage =
    status === "error"
      ? "Não foi possível pesquisar agora."
      : status === "ready"
        ? `Nenhum artigo encontrado para “${term}”.`
        : "Pesquisando…";

  const statusMessage = !term
    ? ""
    : status === "ready" && results.length > 0
      ? results.length === 1
        ? "1 resultado disponível."
        : `${results.length} resultados disponíveis.`
      : status === "idle"
        ? ""
        : emptyMessage;

  return (
    <form
      className="relative w-full max-w-120"
      onSubmit={(event) => {
        event.preventDefault();
        const target = activeResult ?? results[0];
        if (target) openArticle(target);
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Pesquisar na Wikipédia
      </label>
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-md border bg-background px-3 shadow-xs transition-colors",
          focused ? "border-ring ring-2 ring-ring" : "border-input",
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && activeResult ? optionId(activeIndex) : undefined
          }
          aria-keyshortcuts="Control+K Meta+K"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setDismissed(false);
          }}
          onFocus={() => {
            setFocused(true);
            setDismissed(false);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          // biome-ignore lint/a11y/noAutofocus: focuses the field the user just revealed with the search button
          autoFocus={autoFocus}
          placeholder="Pesquisar na Wikipédia"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {status === "loading" && (
          <Loader2
            aria-hidden="true"
            className="size-3.5 shrink-0 animate-spin text-muted-foreground"
          />
        )}
        {query ? (
          <button
            type="button"
            aria-label="Limpar pesquisa"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
              focusRing,
            )}
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <Kbd aria-hidden="true">Ctrl K</Kbd>
        )}
      </div>
      <div
        hidden={!open}
        className="absolute top-[calc(100%+8px)] left-0 z-50 flex w-full flex-col rounded-lg border border-border bg-background p-1.5 shadow-md ring-1 ring-foreground/10"
      >
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
              id={optionId(index)}
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
              <span className="flex min-w-0 flex-col gap-px">
                <span className="truncate text-sm font-medium text-foreground">
                  {result.title}
                </span>
                {result.description && (
                  <span className="truncate text-xs text-muted-foreground">
                    {result.description}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        {results.length === 0 && (
          <p className="px-2.5 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>
      <output aria-live="polite" className="sr-only">
        {statusMessage}
      </output>
    </form>
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
