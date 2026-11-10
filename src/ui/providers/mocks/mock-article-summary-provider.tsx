"use client";

import { type ReactNode, useMemo } from "react";
import {
  ArticleSummaryContext,
  type ArticleSummaryResult,
} from "@/ui/contexts/article-summary-context";
import { chunkSentences } from "@/ui/lib/easy-reading/sentences";

type MockArticleSummaryProviderProps = {
  /**
   * Resultado fixo. Sem ele, o "resumo" são as duas primeiras frases do texto,
   * o que basta para exercitar a interface sem chamar nenhuma IA.
   */
  result?: ArticleSummaryResult | "loading";
  delayMs?: number;
  children: ReactNode;
};

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

export function MockArticleSummaryProvider({
  result,
  delayMs = 0,
  children,
}: MockArticleSummaryProviderProps) {
  const value = useMemo(
    () => ({
      summarizeArticle: async (
        { text }: { text: string },
        signal: AbortSignal,
      ): Promise<ArticleSummaryResult> => {
        if (result === "loading") return new Promise(() => {});
        await wait(delayMs, signal);
        return (
          result ?? {
            status: "ready",
            summary: chunkSentences(text, 2)[0] ?? text,
          }
        );
      },
    }),
    [result, delayMs],
  );

  return (
    <ArticleSummaryContext value={value}>{children}</ArticleSummaryContext>
  );
}
