"use client";

import { ArrowRight, FileText, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn, focusRing } from "@/ui/lib/utils";
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

// The last option is "Ver todos os resultados".
const OPTION_COUNT = SEARCH_RESULTS.length + 1;

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const id = useId();
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function openListbox() {
    setActiveIndex(0);
    setOpen(true);
  }

  function selectOption(index: number) {
    const result = SEARCH_RESULTS[index];
    if (result) {
      setQuery(result.title);
    }
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          setActiveIndex((index) => (index + 1) % OPTION_COUNT);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setActiveIndex(OPTION_COUNT - 1);
          setOpen(true);
        } else {
          setActiveIndex((index) => (index - 1 + OPTION_COUNT) % OPTION_COUNT);
        }
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(OPTION_COUNT - 1);
        }
        break;
      case "Enter":
        if (open) {
          event.preventDefault();
          selectOption(activeIndex);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else if (query) {
          event.preventDefault();
          setQuery("");
        }
        break;
    }
  }

  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        setOpen(false);
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Pesquisar na Wikipédia
      </label>
      <div
        className={cn(
          "flex h-10 w-[480px] items-center gap-2 rounded-md border bg-background px-3 shadow-xs transition-colors",
          open ? "border-ring ring-3 ring-ring/50" : "border-input",
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
          aria-activedescendant={open ? optionId(activeIndex) : undefined}
          aria-keyshortcuts="Control+K Meta+K"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) openListbox();
          }}
          onFocus={openListbox}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar na Wikipédia"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            aria-label="Limpar pesquisa"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
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
        className="absolute top-[calc(100%+8px)] left-0 z-50 w-full rounded-lg border border-border bg-background p-1.5 shadow-md ring-1 ring-foreground/10"
      >
        <div
          id={listboxId}
          role="listbox"
          aria-label="Sugestões de pesquisa"
          className="flex flex-col gap-px"
        >
          {SEARCH_RESULTS.map((result, index) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled by the combobox input via aria-activedescendant.
            <div
              key={result.title}
              id={optionId(index)}
              role="option"
              tabIndex={-1}
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(index)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2",
                index === activeIndex && "bg-accent",
              )}
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex flex-col gap-px">
                <span className="text-sm font-medium text-foreground">
                  {result.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {result.breadcrumb}
                </span>
              </span>
            </div>
          ))}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled by the combobox input via aria-activedescendant. */}
          <div
            id={optionId(SEARCH_RESULTS.length)}
            role="option"
            tabIndex={-1}
            aria-selected={activeIndex === SEARCH_RESULTS.length}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActiveIndex(SEARCH_RESULTS.length)}
            onClick={() => selectOption(SEARCH_RESULTS.length)}
            className={cn(
              "relative mt-2.5 flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 before:absolute before:inset-x-0 before:-top-1.5 before:h-px before:bg-border",
              activeIndex === SEARCH_RESULTS.length && "bg-accent",
            )}
          >
            <span className="flex items-center gap-2">
              <Search className="size-3.5 text-foreground" />
              <span className="text-[13px] font-medium text-foreground">
                Ver todos os resultados
              </span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </form>
  );
}
