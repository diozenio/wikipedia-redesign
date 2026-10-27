"use client";

import {
  ChevronDown,
  ChevronRight,
  Heart,
  House,
  List,
  Newspaper,
  Shuffle,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useArticle } from "@/ui/contexts/article-context";
import { cn } from "@/ui/lib/utils";
import { ScrollArea } from "@/ui/primitives/scroll-area";

const INICIO_ID = "inicio";

const navItems = [
  { label: "Página principal", icon: House },
  { label: "Conteúdo destacado", icon: Star },
  { label: "Eventos atuais", icon: Newspaper },
  { label: "Página aleatória", icon: Shuffle },
  { label: "Fazer uma doação", icon: Heart },
] as const;

export function TableOfContents() {
  const { sections } = useArticle();

  const flatIds = useMemo(
    () => [
      INICIO_ID,
      ...sections.flatMap((section) => [
        section.id,
        ...section.subsections.map((subsection) => subsection.id),
      ]),
    ],
    [sections],
  );

  const titles = useMemo(
    () =>
      new Map([
        [INICIO_ID, "Início"],
        ...sections.flatMap((section) => [
          [section.id, section.title] as const,
          ...section.subsections.map(
            (subsection) => [subsection.id, subsection.title] as const,
          ),
        ]),
      ]),
    [sections],
  );

  const [activeId, setActiveId] = useState(flatIds[0]);
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  function registerItemRef(id: string) {
    return (element: HTMLAnchorElement | null) => {
      if (element) {
        itemRefs.current.set(id, element);
      } else {
        itemRefs.current.delete(id);
      }
    };
  }

  useEffect(() => {
    const elements = flatIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visible = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    function handleScroll() {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(flatIds[flatIds.length - 1]);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [flatIds]);

  useEffect(() => {
    const parent = sections.find((section) =>
      section.subsections.some((subsection) => subsection.id === activeId),
    );
    if (parent) {
      setExpandedIds((previous) => {
        if (previous.has(parent.id)) return previous;
        return new Set(previous).add(parent.id);
      });
    }

    const frame = requestAnimationFrame(() => {
      const item = itemRefs.current.get(activeId);
      const viewport = item?.closest<HTMLElement>(
        "[data-slot='scroll-area-viewport']",
      );
      if (!item || !viewport) return;

      const itemRect = item.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const offset =
        itemRect.top < viewportRect.top
          ? itemRect.top - viewportRect.top
          : Math.max(0, itemRect.bottom - viewportRect.bottom);
      if (offset !== 0) viewport.scrollBy({ top: offset, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeId, sections]);

  function toggleExpanded(id: string) {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setActiveId(id);
    setOpen(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Neste artigo"
      className="flex w-full flex-col rounded-md border border-border @min-[64rem]/page:col-span-2 @min-[84rem]/page:sticky @min-[84rem]/page:top-8 @min-[84rem]/page:col-span-1 @min-[84rem]/page:grid @min-[84rem]/page:max-h-[calc(100vh-4rem)] @min-[84rem]/page:grid-rows-[auto_minmax(0,1fr)_auto] @min-[84rem]/page:gap-6 @min-[84rem]/page:rounded-none @min-[84rem]/page:border-0"
    >
      <div className="hidden items-center gap-2 @min-[84rem]/page:flex">
        <List className="size-4 text-muted-foreground" />
        <span className="text-[0.8125rem] font-semibold text-foreground">
          Neste artigo
        </span>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="table-of-contents-list"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center gap-2 rounded-md px-3.5 py-2.5 text-left text-sm @min-[84rem]/page:hidden"
      >
        <List className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-semibold text-foreground">Neste artigo</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          · {titles.get(activeId)}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <ScrollArea
        id="table-of-contents-list"
        className={cn(
          "min-h-0 @min-[84rem]/page:block",
          open
            ? "border-t border-border p-2 @min-[84rem]/page:border-0 @min-[84rem]/page:p-0"
            : "hidden",
        )}
      >
        <div className="pr-3">
          <ul className="flex flex-col gap-0.5 border-l border-border">
            <li>
              <a
                ref={registerItemRef(INICIO_ID)}
                href={`#${INICIO_ID}`}
                onClick={(event) => handleClick(event, INICIO_ID)}
                className={cn(
                  "block rounded-r-md py-1.5 pr-3 pl-3 text-[0.8125rem]",
                  activeId === INICIO_ID
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Início
              </a>
            </li>
            {sections.map((section) => {
              const hasSubsections = section.subsections.length > 0;
              const expanded = expandedIds.has(section.id);

              return (
                <li key={section.id}>
                  <div className="flex items-center">
                    <a
                      ref={registerItemRef(section.id)}
                      href={`#${section.id}`}
                      onClick={(event) => handleClick(event, section.id)}
                      className={cn(
                        "block flex-1 rounded-r-md py-1.5 pr-3 pl-3 text-[0.8125rem]",
                        activeId === section.id
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {section.title}
                    </a>
                    {hasSubsections && (
                      <button
                        type="button"
                        aria-label={
                          expanded ? "Recolher seção" : "Expandir seção"
                        }
                        onClick={() => toggleExpanded(section.id)}
                        className="flex size-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight
                          className={cn(
                            "size-3.5 transition-transform",
                            expanded && "rotate-90",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {hasSubsections && expanded && (
                    <ul className="flex flex-col gap-0.5">
                      {section.subsections.map((subsection) => (
                        <li key={subsection.id}>
                          <a
                            ref={registerItemRef(subsection.id)}
                            href={`#${subsection.id}`}
                            onClick={(event) =>
                              handleClick(event, subsection.id)
                            }
                            className={cn(
                              "block rounded-r-md py-1.5 pr-3 pl-6.5 text-[0.8125rem]",
                              activeId === subsection.id
                                ? "bg-accent font-medium text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {subsection.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollArea>
      <div className="hidden flex-col gap-2 @min-[84rem]/page:flex">
        <span className="text-[0.6875rem] font-semibold tracking-[0.07em] text-muted-foreground">
          NAVEGAÇÃO
        </span>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 py-1.5 text-[0.8125rem] text-foreground"
            >
              <item.icon className="size-3.5 text-muted-foreground" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
