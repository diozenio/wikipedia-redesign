"use client";

import type { ReactNode } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";
import { SearchContext } from "@/ui/contexts/search-context";
import { mockArticles } from "@/ui/providers/mocks/mock-article";

const MAX_RESULTS = 6;

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function searchMockArticles(query: string): ArticleSummaryData[] {
  const term = normalize(query.trim());

  return mockArticles
    .filter((article) => normalize(article.title).includes(term))
    .slice(0, MAX_RESULTS)
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.badges[0] ?? null,
      excerpt: null,
      thumbnail: null,
    }));
}

const value = {
  searchArticles: async (query: string) => searchMockArticles(query),
};

export function MockSearchProvider({ children }: { children: ReactNode }) {
  return <SearchContext value={value}>{children}</SearchContext>;
}
