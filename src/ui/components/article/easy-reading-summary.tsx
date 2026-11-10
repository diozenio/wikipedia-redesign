"use client";

import { BookOpenText, Sparkles } from "lucide-react";
import { useId } from "react";
import { useAppearance } from "@/ui/contexts/appearance-context";
import { useArticle } from "@/ui/contexts/article-context";
import { paragraphsToPlainText } from "@/ui/lib/easy-reading/block-text";
import { chunkSentences } from "@/ui/lib/easy-reading/sentences";
import {
  type ArticleSummaryState,
  useArticleSummary,
} from "@/ui/lib/easy-reading/use-article-summary";
import { Skeleton } from "@/ui/primitives/skeleton";

const UNAVAILABLE_NOTES = {
  not_configured:
    "Resumo por IA indisponível. Configure OPENROUTER_API_KEY para ativar.",
  error: "Não foi possível gerar o resumo por IA agora.",
} as const;

export function EasyReadingSummaryCard({
  state,
  introText,
}: {
  state: ArticleSummaryState;
  introText: string;
}) {
  const headingId = useId();
  const isLoading = state.status === "loading";
  const isSummary = state.status === "ready";
  const fallback = chunkSentences(introText, 2)[0];

  if (state.status === "unavailable" && !fallback) return null;

  const Icon = isSummary || isLoading ? Sparkles : BookOpenText;

  return (
    <aside
      aria-labelledby={headingId}
      aria-busy={isLoading}
      className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4 high-contrast:bg-background"
    >
      <h2
        id={headingId}
        className="flex items-center gap-2 text-base font-semibold text-foreground"
      >
        <Icon aria-hidden className="size-4 shrink-0" />
        {state.status === "unavailable"
          ? "Introdução do artigo"
          : "Resumo simplificado"}
      </h2>

      {isLoading && (
        <div className="flex flex-col gap-2 py-1">
          <span className="sr-only">Gerando resumo…</span>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {state.status === "ready" && (
        <p className="text-base text-foreground">{state.summary}</p>
      )}

      {state.status === "unavailable" && (
        <p className="text-base text-foreground">{fallback}</p>
      )}

      {state.status === "ready" && (
        <p className="text-xs text-muted-foreground">
          Gerado por IA a partir da introdução do artigo.
        </p>
      )}

      {state.status === "unavailable" && (
        <p className="text-xs text-muted-foreground">
          {UNAVAILABLE_NOTES[state.reason]}
        </p>
      )}
    </aside>
  );
}

function EasyReadingSummaryLoader() {
  const { id, title, introBlocks } = useArticle();
  const introText = paragraphsToPlainText(introBlocks);
  const state = useArticleSummary({
    articleId: id,
    title,
    text: introText,
    enabled: true,
  });

  return <EasyReadingSummaryCard state={state} introText={introText} />;
}

export function EasyReadingSummary() {
  const { appearance } = useAppearance();

  if (!appearance.easyReading) return null;

  return <EasyReadingSummaryLoader />;
}
