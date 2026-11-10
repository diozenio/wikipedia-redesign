import type { Metadata } from "next";
import { HomePageLayout } from "@/ui/layouts/home-page-layout";
import { getTodayFeaturedDate, isFeaturedDate } from "@/ui/lib/featured-date";
import { AppProvider } from "@/ui/providers/app-provider";
import { MediaWikiFeaturedArticlesProvider } from "@/ui/providers/mediawiki-featured-articles-provider";
import { MediaWikiSearchProvider } from "@/ui/providers/mediawiki-search-provider";

export const metadata: Metadata = {
  title: { absolute: "Wikipédia, a enciclopédia livre" },
};

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { date } = await searchParams;

  return (
    <AppProvider>
      <MediaWikiSearchProvider>
        <MediaWikiFeaturedArticlesProvider
          date={isFeaturedDate(date) ? date : getTodayFeaturedDate()}
        >
          <HomePageLayout />
        </MediaWikiFeaturedArticlesProvider>
      </MediaWikiSearchProvider>
    </AppProvider>
  );
}
