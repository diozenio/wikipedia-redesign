"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useArticle } from "@/ui/contexts/article-context";
import {
  SeeAlsoContext,
  type SeeAlsoContextValue,
} from "@/ui/contexts/see-also-context";
import { fetchMediaWikiRelatedArticles } from "@/ui/lib/mediawiki/api";
import { mapMediaWikiGeneratorToSummaries } from "@/ui/lib/mediawiki/summary-mapper";

export function MediaWikiSeeAlsoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { title } = useArticle();
  const [value, setValue] = useState<SeeAlsoContextValue>({
    status: "loading",
    articles: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    setValue({ status: "loading", articles: [] });

    fetchMediaWikiRelatedArticles(title, { signal: controller.signal })
      .then((response) => {
        setValue({
          status: "ready",
          articles: mapMediaWikiGeneratorToSummaries(response),
        });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setValue({ status: "error", articles: [] });
      });

    return () => controller.abort();
  }, [title]);

  return <SeeAlsoContext value={value}>{children}</SeeAlsoContext>;
}
