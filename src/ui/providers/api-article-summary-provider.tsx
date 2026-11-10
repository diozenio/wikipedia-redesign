"use client";

import type { ReactNode } from "react";
import { ArticleSummaryContext } from "@/ui/contexts/article-summary-context";
import { fetchArticleSummary } from "@/ui/lib/easy-reading/article-summary-api";

const value = { summarizeArticle: fetchArticleSummary };

/** Gera o resumo da leitura facilitada chamando a rota `/api/articles/:id/summary`. */
export function ApiArticleSummaryProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ArticleSummaryContext value={value}>{children}</ArticleSummaryContext>
  );
}
