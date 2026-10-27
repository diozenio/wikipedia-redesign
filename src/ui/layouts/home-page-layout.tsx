import { SiteFooter } from "@/ui/components/footer/site-footer";
import { SiteHeader } from "@/ui/components/header/site-header";
import { FeaturedArticles } from "@/ui/components/home/featured-articles";
import { HomeHero } from "@/ui/components/home/home-hero";

export function HomePageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="@container/page w-full flex-1">
        <div className="mx-auto flex w-full max-w-[78rem] flex-col gap-8 px-4 pt-8 pb-12 @min-[48rem]/page:gap-12 @min-[48rem]/page:px-6 @min-[48rem]/page:pt-14 @min-[48rem]/page:pb-20 @min-[84rem]/page:px-8">
          <HomeHero />
          <FeaturedArticles />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
