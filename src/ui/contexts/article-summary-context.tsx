"use client";

import { createContext, useContext } from "react";

export type ArticleSummaryResult =
  | { status: "ready"; summary: string }
  | { status: "unavailable"; reason: "not_configured" | "error" };

export type ArticleSummaryInput = {
  articleId: string;
  title: string;
  text: string;
};

export type ArticleSummaryContextValue = {
  summarizeArticle: (
    input: ArticleSummaryInput,
    signal: AbortSignal,
  ) => Promise<ArticleSummaryResult>;
};

export const ArticleSummaryContext =
  createContext<ArticleSummaryContextValue | null>(null);

export function useArticleSummaryService() {
  const context = useContext(ArticleSummaryContext);

  if (!context) {
    throw new Error(
      "useArticleSummaryService must be used within an ArticleSummaryContext provider",
    );
  }

  return context;
}
