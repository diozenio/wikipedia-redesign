"use client";

import {
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
import { cn, focusRing } from "@/ui/lib/utils";
import { ScrollArea } from "@/ui/primitives/scroll-area";

const INICIO_ID = "inicio";
const TOC_HEADING_ID = "sumario-titulo";
const SITE_NAV_HEADING_ID = "navegacao-titulo";

const navItems = [
  { label: "Página principal", icon: House, href: "/" },
  {
    label: "Conteúdo destacado",
    icon: Star,
    href: "https://pt.wikipedia.org/wiki/Portal:Conteúdo_destacado",
  },
  {
    label: "Eventos atuais",
    icon: Newspaper,
    href: "https://pt.wikipedia.org/wiki/Portal:Eventos_atuais",
  },
  {
    label: "Página aleatória",
    icon: Shuffle,
    href: "https://pt.wikipedia.org/wiki/Especial:Aleatória",
  },
  {
    label: "Fazer uma doação",
    icon: Heart,
    href: "https://donate.wikimedia.org/?uselang=pt",
  },
] as const;

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

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

  const [activeId, setActiveId] = useState(flatIds[0]);
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

    // Scroll only the TOC viewport: `scrollIntoView` would also move the
    // browser's sequential focus starting point, making the first Tab skip
    // everything before the active item.
    const frame = requestAnimationFrame(() => {
      const item = itemRefs.current.get(activeId);
      const viewport = item?.closest<HTMLElement>(
        '[data-slot="scroll-area-viewport"]',
      );
      if (!item || !viewport) return;

      const itemRect = item.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const offset =
        itemRect.top < viewportRect.top
          ? itemRect.top - viewportRect.top
          : Math.max(0, itemRect.bottom - viewportRect.bottom);

      if (offset !== 0) {
        viewport.scrollBy({ top: offset, behavior: scrollBehavior() });
      }
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
    target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });

    // Move focus to the target so keyboard and screen reader users continue
    // from the section they jumped to, like a native anchor navigation would.
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });
  }

  return (
    <div className="sticky top-8 grid max-h-[calc(100vh-4rem)] w-[232px] shrink-0 grid-rows-[minmax(0,1fr)_auto] gap-6">
      <nav
        aria-labelledby={TOC_HEADING_ID}
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6"
      >
        <div className="flex items-center gap-2">
          <List className="size-4 text-muted-foreground" />
          <h2
            id={TOC_HEADING_ID}
            className="text-[13px] font-semibold text-foreground"
          >
            Neste artigo
          </h2>
        </div>
        <ScrollArea className="min-h-0">
          <div className="pr-3">
            <ul className="flex flex-col gap-0.5 border-l border-border">
              <li>
                <a
                  ref={registerItemRef(INICIO_ID)}
                  href={`#${INICIO_ID}`}
                  aria-current={activeId === INICIO_ID ? "location" : undefined}
                  onClick={(event) => handleClick(event, INICIO_ID)}
                  className={cn(
                    "block rounded-r-md py-1.5 pr-3 pl-3 text-[13px]",
                    focusRing,
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
                const subsectionsId = `${section.id}-subsecoes`;

                return (
                  <li key={section.id}>
                    <div className="flex items-center">
                      <a
                        ref={registerItemRef(section.id)}
                        href={`#${section.id}`}
                        aria-current={
                          activeId === section.id ? "location" : undefined
                        }
                        onClick={(event) => handleClick(event, section.id)}
                        className={cn(
                          "block flex-1 rounded-r-md py-1.5 pr-3 pl-3 text-[13px]",
                          focusRing,
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
                          aria-label={`Subseções de ${section.title}`}
                          aria-expanded={expanded}
                          aria-controls={subsectionsId}
                          onClick={() => toggleExpanded(section.id)}
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground",
                            focusRing,
                          )}
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
                    {hasSubsections && (
                      <ul
                        id={subsectionsId}
                        hidden={!expanded}
                        className="flex flex-col gap-0.5"
                      >
                        {section.subsections.map((subsection) => (
                          <li key={subsection.id}>
                            <a
                              ref={registerItemRef(subsection.id)}
                              href={`#${subsection.id}`}
                              aria-current={
                                activeId === subsection.id
                                  ? "location"
                                  : undefined
                              }
                              onClick={(event) =>
                                handleClick(event, subsection.id)
                              }
                              className={cn(
                                "block rounded-r-md py-1.5 pr-3 pl-6.5 text-[13px]",
                                focusRing,
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
      </nav>
      <nav
        aria-labelledby={SITE_NAV_HEADING_ID}
        className="flex flex-col gap-2"
      >
        <h2
          id={SITE_NAV_HEADING_ID}
          className="text-[11px] font-semibold tracking-[0.8px] text-muted-foreground uppercase"
        >
          Navegação
        </h2>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md py-1.5 text-[13px] text-foreground hover:underline",
                  focusRing,
                )}
              >
                <item.icon className="size-3.5 text-muted-foreground" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
