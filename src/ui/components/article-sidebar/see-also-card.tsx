"use client";

import { Compass, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { useSeeAlso } from "@/ui/contexts/see-also-context";
import { cn, focusRing } from "@/ui/lib/utils";
import { Skeleton } from "@/ui/primitives/skeleton";

export function SeeAlsoCard() {
  const { status, articles } = useSeeAlso();

  return (
    <SidebarCard icon={Compass} title="Ver também">
      <div className="flex flex-col px-5 pb-4">
        {status === "loading" ? (
          <div aria-busy="true" className="flex flex-col gap-3 py-1.5">
            <span className="sr-only">Carregando artigos relacionados</span>
            {["a", "b", "c", "d"].map((key) => (
              <Skeleton key={key} className="h-4 w-4/5" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <ul className="flex flex-col">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/articles/${encodeURIComponent(article.slug)}`}
                  className={cn(
                    "group flex items-start gap-2 rounded-sm py-1.5",
                    focusRing,
                  )}
                >
                  <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex min-w-0 flex-col gap-px">
                    <span className="text-sm text-foreground group-hover:underline">
                      {article.title}
                    </span>
                    {article.description && (
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {article.description}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-1.5 text-sm text-muted-foreground">
            {status === "error"
              ? "Não foi possível carregar os artigos relacionados."
              : "Nenhum artigo relacionado encontrado."}
          </p>
        )}
      </div>
    </SidebarCard>
  );
}
