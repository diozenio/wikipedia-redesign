"use client";

import type { ReactNode } from "react";
import { ArticleContext } from "@/ui/contexts/article-context";
import { mapMediaWikiArticleToDomain } from "@/ui/lib/mediawiki/article-mapper";
import type {
  MediaWikiPageResponse,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";
import mediaWikiContent from "@/ui/providers/mocks/mediawiki/sistema-de-informacao.content.json";
import mediaWikiPage from "@/ui/providers/mocks/mediawiki/sistema-de-informacao.page.json";

const article = mapMediaWikiArticleToDomain(
  (mediaWikiPage as unknown as MediaWikiPageResponse).query.pages[0],
  mediaWikiContent as unknown as MediaWikiSection[],
);

export function MockArticleProvider({ children }: { children: ReactNode }) {
  return <ArticleContext value={article}>{children}</ArticleContext>;
}
