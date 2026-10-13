"use client";

import { createContext, useContext } from "react";
import type { ArticleData } from "@/ui/components/article/types";

export const ArticleContext = createContext<ArticleData | null>(null);

export function useArticle() {
  const context = useContext(ArticleContext);

  if (!context) {
    throw new Error(
      "useArticle must be used within an ArticleContext provider",
    );
  }

  return context;
}
