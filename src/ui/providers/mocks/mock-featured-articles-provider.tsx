"use client";

import { type ReactNode, useMemo } from "react";
import { FeaturedArticlesContext } from "@/ui/contexts/featured-articles-context";
import {
  findMockFeaturedFeed,
  mockFeaturedFeed,
} from "@/ui/providers/mocks/mock-featured-articles";

type MockFeaturedArticlesProviderProps = {
  date?: string;
  children: ReactNode;
};

export function MockFeaturedArticlesProvider({
  date,
  children,
}: MockFeaturedArticlesProviderProps) {
  const value = useMemo(() => {
    const feed = date
      ? (findMockFeaturedFeed(date) ?? { date, articles: [] })
      : mockFeaturedFeed;
    return { ...feed, status: "ready" as const };
  }, [date]);

  return (
    <FeaturedArticlesContext value={value}>{children}</FeaturedArticlesContext>
  );
}
