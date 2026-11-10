"use client";

import { type ReactNode, useEffect, useState } from "react";
import {
  FeaturedArticlesContext,
  type FeaturedArticlesContextValue,
} from "@/ui/contexts/featured-articles-context";
import {
  fetchMediaWikiFeaturedFeed,
  MediaWikiNotFoundError,
} from "@/ui/lib/mediawiki/api";
import { mapMediaWikiFeaturedFeedToDomain } from "@/ui/lib/mediawiki/featured-mapper";

type MediaWikiFeaturedArticlesProviderProps = {
  date: string;
  children: ReactNode;
};

export function MediaWikiFeaturedArticlesProvider({
  date,
  children,
}: MediaWikiFeaturedArticlesProviderProps) {
  const [value, setValue] = useState<FeaturedArticlesContextValue>({
    date,
    status: "loading",
    articles: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    setValue({ date, status: "loading", articles: [] });

    fetchMediaWikiFeaturedFeed(date, { signal: controller.signal })
      .then((feed) => {
        setValue({
          ...mapMediaWikiFeaturedFeedToDomain(feed, date),
          status: "ready",
        });
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setValue({
          date,
          status: reason instanceof MediaWikiNotFoundError ? "ready" : "error",
          articles: [],
        });
      });

    return () => controller.abort();
  }, [date]);

  return (
    <FeaturedArticlesContext value={value}>{children}</FeaturedArticlesContext>
  );
}
