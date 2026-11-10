"use client";

import { createContext, useContext } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";

export type SearchContextValue = {
  searchArticles: (
    query: string,
    signal: AbortSignal,
  ) => Promise<ArticleSummaryData[]>;
};

export const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchContext provider");
  }

  return context;
}
