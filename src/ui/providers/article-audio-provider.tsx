"use client";

import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { ArticleAudioContext } from "@/ui/contexts/article-audio-context";
import { useArticle } from "@/ui/contexts/article-context";
import {
  type ArticleAudioPhase,
  useArticleAudio,
} from "@/ui/lib/article-audio/use-article-audio";

const ERROR_MESSAGE = "Não foi possível gerar o áudio do artigo.";

function useErrorToast(phase: ArticleAudioPhase) {
  useEffect(() => {
    if (phase === "error") toast.error(ERROR_MESSAGE);
  }, [phase]);
}

export function ArticleAudioProvider({ children }: { children: ReactNode }) {
  const { id } = useArticle();
  const audio = useArticleAudio(id);
  useErrorToast(audio.phase);

  return <ArticleAudioContext value={audio}>{children}</ArticleAudioContext>;
}
