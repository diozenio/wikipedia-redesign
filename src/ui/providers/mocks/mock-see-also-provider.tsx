"use client";

import { type ReactNode, useMemo } from "react";
import { useArticle } from "@/ui/contexts/article-context";
import { SeeAlsoContext } from "@/ui/contexts/see-also-context";
import { mapMediaWikiGeneratorToSummaries } from "@/ui/lib/mediawiki/summary-mapper";
import type { MediaWikiGeneratorResponse } from "@/ui/lib/mediawiki/types";
import sistemaDeInformacaoRelated from "@/ui/providers/mocks/mediawiki/related/sistema-de-informacao.json";

const mockRelatedArticles: Record<string, MediaWikiGeneratorResponse> = {
  Sistema_de_informação:
    sistemaDeInformacaoRelated as unknown as MediaWikiGeneratorResponse,
};

export function MockSeeAlsoProvider({ children }: { children: ReactNode }) {
  const { slug } = useArticle();

  const value = useMemo(() => {
    const response = mockRelatedArticles[slug];
    return {
      status: "ready" as const,
      articles: response ? mapMediaWikiGeneratorToSummaries(response) : [],
    };
  }, [slug]);

  return <SeeAlsoContext value={value}>{children}</SeeAlsoContext>;
}
