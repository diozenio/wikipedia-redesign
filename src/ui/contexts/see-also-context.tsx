"use client";

import { createContext, useContext } from "react";
import type { ArticleSummaryData } from "@/ui/components/article/types";

export type SeeAlsoContextValue = {
  status: "loading" | "ready" | "error";
  articles: ArticleSummaryData[];
};

export const SeeAlsoContext = createContext<SeeAlsoContextValue | null>(null);

export function useSeeAlso() {
  const context = useContext(SeeAlsoContext);

  if (!context) {
    throw new Error("useSeeAlso must be used within a SeeAlsoContext provider");
  }

  return context;
}
