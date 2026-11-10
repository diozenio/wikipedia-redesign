"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { ArticleData } from "@/ui/components/article/types";
import { ArticleContext } from "@/ui/contexts/article-context";
import {
  fetchMediaWikiHtml,
  fetchMediaWikiPage,
  MediaWikiNotFoundError,
} from "@/ui/lib/mediawiki/api";
import { mapMediaWikiArticleToDomain } from "@/ui/lib/mediawiki/article-mapper";
import { parseParsoidSections } from "@/ui/lib/mediawiki/parsoid-sections";

type ArticleState =
  | { status: "loading" }
  | { status: "ready"; article: ArticleData }
  | { status: "not-found" }
  | { status: "error" };

type MediaWikiArticleProviderProps = {
  slug: string;
  fallback?: ReactNode;
  notFound?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

export function MediaWikiArticleProvider({
  slug,
  fallback = null,
  notFound = null,
  error = null,
  children,
}: MediaWikiArticleProviderProps) {
  const [state, setState] = useState<ArticleState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    const options = { signal: controller.signal };

    Promise.all([
      fetchMediaWikiPage(slug, options),
      fetchMediaWikiHtml(slug, options),
    ])
      .then(([page, html]) => {
        const document = new DOMParser().parseFromString(html, "text/html");
        setState({
          status: "ready",
          article: mapMediaWikiArticleToDomain(
            page,
            parseParsoidSections(document),
          ),
        });
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status:
            reason instanceof MediaWikiNotFoundError ? "not-found" : "error",
        });
      });

    return () => controller.abort();
  }, [slug]);

  switch (state.status) {
    case "loading":
      return fallback;
    case "not-found":
      return notFound;
    case "error":
      return error;
    case "ready":
      return <ArticleContext value={state.article}>{children}</ArticleContext>;
  }
}
