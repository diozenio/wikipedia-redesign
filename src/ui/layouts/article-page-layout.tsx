import { ArticleColumn } from "@/ui/components/article/article-column";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";
import { SiteFooter } from "@/ui/components/footer/site-footer";
import { SiteHeader } from "@/ui/components/header/site-header";
import { TableOfContents } from "@/ui/components/table-of-contents/table-of-contents";

// Breakpoints are container queries in rem, so they react to the reading
// font scale as well as to browser zoom: larger text reflows to fewer columns.
export function ArticlePageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="@container/page w-full">
        <div className="mx-auto grid w-full max-w-[52rem] grid-cols-1 gap-6 px-4 pt-4 pb-10 @min-[48rem]/page:px-6 @min-[48rem]/page:pt-6 @min-[64rem]/page:max-w-none @min-[64rem]/page:grid-cols-[minmax(0,1fr)_20rem] @min-[64rem]/page:items-start @min-[64rem]/page:gap-x-10 @min-[84rem]/page:grid-cols-[14.5rem_minmax(0,1fr)_20rem] @min-[84rem]/page:gap-x-12 @min-[84rem]/page:px-8 @min-[84rem]/page:pt-8 @min-[84rem]/page:pb-12">
          <TableOfContents />
          <ArticleColumn />
          <ArticleSidebar />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
