"use client";

import { useEffect, useState } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";
import { useSearch } from "@/ui/contexts/search-context";

const DEBOUNCE_MS = 250;

export type ArticleSearchState =
  | { status: "idle"; results: [] }
  | { status: "loading"; results: ArticleSummaryData[] }
  | { status: "ready"; results: ArticleSummaryData[] }
  | { status: "error"; results: [] };

export function useArticleSearch(query: string): ArticleSearchState {
  const { searchArticles } = useSearch();
  const [state, setState] = useState<ArticleSearchState>({
    status: "idle",
    results: [],
  });
  const term = query.trim();

  useEffect(() => {
    if (!term) {
      setState({ status: "idle", results: [] });
      return;
    }

    const controller = new AbortController();
    setState((current) => ({ status: "loading", results: current.results }));

    const timer = setTimeout(() => {
      searchArticles(term, controller.signal)
        .then((results) => setState({ status: "ready", results }))
        .catch(() => {
          if (controller.signal.aborted) return;
          setState({ status: "error", results: [] });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, searchArticles]);

  return state;
}
