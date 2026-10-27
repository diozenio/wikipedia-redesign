"use client";

import { Compass, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { useSeeAlso } from "@/ui/contexts/see-also-context";
import { Skeleton } from "@/ui/primitives/skeleton";

export function SeeAlsoCard() {
  const { status, articles } = useSeeAlso();

  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Compass className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Ver também
        </span>
      </div>
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
                  className="group flex items-start gap-2 rounded-sm py-1.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
    </div>
  );
}
