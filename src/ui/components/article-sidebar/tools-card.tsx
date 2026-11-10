"use client";

import {
  Database,
  FileDown,
  Link,
  type LucideIcon,
  Printer,
  Quote,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import type { ArticleData } from "@/ui/components/article/types";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { useArticle } from "@/ui/contexts/article-context";
import { cn, focusRing } from "@/ui/lib/utils";

const WIKI_ORIGIN = "https://pt.wikipedia.org";

type Tool =
  | { label: string; icon: LucideIcon; href: string }
  | { label: string; icon: LucideIcon; onSelect: () => void };

const itemClass = cn(
  "flex w-full items-center gap-2.5 rounded-md p-2 text-left hover:bg-muted",
  focusRing,
);

function permalinkOf(article: ArticleData) {
  return article.revisionId
    ? `${WIKI_ORIGIN}/w/index.php?title=${encodeURIComponent(article.slug)}&oldid=${article.revisionId}`
    : article.sourceUrl;
}

function citationOf(article: ArticleData) {
  const accessed = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date());
  return `${article.title}. In: Wikipédia, a enciclopédia livre. Disponível em: ${permalinkOf(article)}. Acesso em: ${accessed}.`;
}

async function copy(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(success);
  } catch {
    toast.error("Não foi possível copiar para a área de transferência.");
  }
}

function toolsOf(article: ArticleData): Tool[] {
  const key = encodeURIComponent(article.slug);

  return [
    {
      label: "Citar esta página",
      icon: Quote,
      onSelect: () => copy(citationOf(article), "Citação copiada."),
    },
    {
      label: "Baixar como PDF",
      icon: FileDown,
      href: `${WIKI_ORIGIN}/api/rest_v1/page/pdf/${key}`,
    },
    {
      label: "Versão para impressão",
      icon: Printer,
      onSelect: () => window.print(),
    },
    {
      label: "Link permanente",
      icon: Link,
      onSelect: () => copy(permalinkOf(article), "Link permanente copiado."),
    },
    {
      label: "Item no Wikidata",
      icon: Database,
      href: `https://www.wikidata.org/wiki/Special:ItemByTitle/ptwiki/${key}`,
    },
  ];
}

export function ToolsCard() {
  const article = useArticle();

  return (
    <SidebarCard icon={Wrench} title="Ferramentas">
      <ul className="flex flex-col gap-1 px-5 pb-4">
        {toolsOf(article).map((tool) => {
          const content = (
            <>
              <tool.icon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm text-foreground">{tool.label}</span>
            </>
          );

          return (
            <li key={tool.label}>
              {"href" in tool ? (
                <a href={tool.href} className={itemClass}>
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={tool.onSelect}
                  className={itemClass}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </SidebarCard>
  );
}
