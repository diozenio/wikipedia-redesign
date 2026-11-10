import type { FeaturedFeedData } from "@/ui/components/home/types";
import { mapMediaWikiFeaturedFeedToDomain } from "@/ui/lib/mediawiki/featured-mapper";
import type { MediaWikiFeaturedFeed } from "@/ui/lib/mediawiki/types";
import featured20260101 from "@/ui/providers/mocks/mediawiki/featured/2026-01-01.json";

const mockFeaturedFeeds: Record<string, MediaWikiFeaturedFeed> = {
  "2026-01-01": featured20260101 as unknown as MediaWikiFeaturedFeed,
};

export function findMockFeaturedFeed(date: string): FeaturedFeedData | null {
  const availableDate = Object.keys(mockFeaturedFeeds)
    .filter((mockDate) => mockDate <= date)
    .sort()
    .at(-1);

  if (!availableDate) return null;

  return mapMediaWikiFeaturedFeedToDomain(
    mockFeaturedFeeds[availableDate],
    availableDate,
  );
}

export const mockFeaturedFeed: FeaturedFeedData =
  mapMediaWikiFeaturedFeedToDomain(
    featured20260101 as unknown as MediaWikiFeaturedFeed,
    "2026-01-01",
  );
