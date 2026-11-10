"use client";

import { createContext, useContext } from "react";
import type { ArticleAudio } from "@/ui/lib/article-audio/use-article-audio";

export const ArticleAudioContext = createContext<ArticleAudio | null>(null);

export function useArticleAudioContext() {
  const context = useContext(ArticleAudioContext);

  if (!context) {
    throw new Error(
      "useArticleAudioContext must be used within an ArticleAudioProvider",
    );
  }

  return context;
}
