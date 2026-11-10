import type { Metadata } from "next";
import { HomePageLayout } from "@/ui/layouts/home-page-layout";
import { getTodayFeaturedDate, isFeaturedDate } from "@/ui/lib/featured-date";
import { AppProvider } from "@/ui/providers/app-provider";
import {
  FeaturedArticlesProvider,
  SearchProvider,
} from "@/ui/providers/data-providers";

export const metadata: Metadata = {
  title: { absolute: "Wikipédia, a enciclopédia livre" },
};

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { date } = await searchParams;

  return (
    <AppProvider>
      <SearchProvider>
        <FeaturedArticlesProvider
          date={isFeaturedDate(date) ? date : getTodayFeaturedDate()}
        >
          <HomePageLayout />
        </FeaturedArticlesProvider>
      </SearchProvider>
    </AppProvider>
  );
}
