"use client";

import { createContext, useContext } from "react";
import type { FeaturedFeedData } from "@/ui/components/home/types";

export type FeaturedArticlesContextValue = FeaturedFeedData & {
  status: "loading" | "ready" | "error";
};

export const FeaturedArticlesContext =
  createContext<FeaturedArticlesContextValue | null>(null);

export function useFeaturedArticles() {
  const context = useContext(FeaturedArticlesContext);

  if (!context) {
    throw new Error(
      "useFeaturedArticles must be used within a FeaturedArticlesContext provider",
    );
  }

  return context;
}
