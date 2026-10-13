import { ArticleColumn } from "@/ui/components/article/article-column";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";
import { SiteFooter } from "@/ui/components/footer/site-footer";
import { SiteHeader } from "@/ui/components/header/site-header";
import { TableOfContents } from "@/ui/components/table-of-contents/table-of-contents";

export function ArticlePageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex w-full gap-12 px-8 pt-8 pb-12">
        <TableOfContents />
        <ArticleColumn />
        <ArticleSidebar />
      </div>
      <SiteFooter />
    </div>
  );
}
