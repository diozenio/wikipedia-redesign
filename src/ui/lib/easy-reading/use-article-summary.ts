"use client";

import { useEffect, useState } from "react";
import {
  type ArticleSummaryResult,
  useArticleSummaryService,
} from "@/ui/contexts/article-summary-context";

export type ArticleSummaryState = { status: "loading" } | ArticleSummaryResult;

const MAX_TEXT_LENGTH = 6000;

export function useArticleSummary({
  articleId,
  title,
  text,
  enabled,
}: {
  articleId: string;
  title: string;
  text: string;
  enabled: boolean;
}): ArticleSummaryState {
  const { summarizeArticle } = useArticleSummaryService();
  const input = text.slice(0, MAX_TEXT_LENGTH);
  const key = `${articleId}\n${title}\n${input}`;
  const [result, setResult] = useState<{
    key: string;
    value: ArticleSummaryResult;
  } | null>(null);

  useEffect(() => {
    if (!enabled || !input) return;

    const controller = new AbortController();

    summarizeArticle({ articleId, title, text: input }, controller.signal)
      .then((value) => setResult({ key, value }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setResult({ key, value: { status: "unavailable", reason: "error" } });
      });

    return () => controller.abort();
  }, [summarizeArticle, articleId, title, input, key, enabled]);

  if (!input) return { status: "unavailable", reason: "error" };
  if (result?.key !== key) return { status: "loading" };
  return result.value;
}
