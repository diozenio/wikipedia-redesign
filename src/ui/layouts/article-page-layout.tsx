import { ArticleColumn } from "@/ui/components/article/article-column";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";
import { SiteFooter } from "@/ui/components/footer/site-footer";
import { SiteHeader } from "@/ui/components/header/site-header";
import { SkipLink } from "@/ui/components/skip-link";
import { TableOfContents } from "@/ui/components/table-of-contents/table-of-contents";

const MAIN_CONTENT_ID = "conteudo";

export function ArticlePageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <SiteHeader />
      <div className="flex w-full items-start gap-12 px-8 pt-8 pb-12">
        <TableOfContents />
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="w-full scroll-mt-8 outline-none"
        >
          <ArticleColumn />
        </main>
        <ArticleSidebar />
      </div>
      <SiteFooter />
    </div>
  );
}
