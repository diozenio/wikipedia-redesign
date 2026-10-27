"use client";

import type { ReactNode } from "react";
import { SearchContext } from "@/ui/contexts/search-context";
import { searchMediaWikiArticles } from "@/ui/lib/mediawiki/api";
import { mapMediaWikiGeneratorToSummaries } from "@/ui/lib/mediawiki/summary-mapper";

const value = {
  searchArticles: async (query: string, signal: AbortSignal) =>
    mapMediaWikiGeneratorToSummaries(
      await searchMediaWikiArticles(query, { signal }),
    ),
};

export function MediaWikiSearchProvider({ children }: { children: ReactNode }) {
  return <SearchContext value={value}>{children}</SearchContext>;
}
