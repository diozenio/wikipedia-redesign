import { ArticleColumn } from "@/ui/components/article/article-column";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";
import { ArticleAudioPlayer } from "@/ui/components/audio-player/article-audio-player";
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
      <div className="@container/page w-full">
        <div className="mx-auto grid w-full max-w-[52rem] grid-cols-1 gap-6 px-4 pt-4 pb-10 @min-[48rem]/page:px-6 @min-[48rem]/page:pt-6 @min-[64rem]/page:max-w-none @min-[64rem]/page:grid-cols-[minmax(0,1fr)_20rem] @min-[64rem]/page:items-start @min-[64rem]/page:gap-x-10 @min-[84rem]/page:grid-cols-[14.5rem_minmax(0,1fr)_20rem] @min-[84rem]/page:gap-x-12 @min-[84rem]/page:px-8 @min-[84rem]/page:pt-8 @min-[84rem]/page:pb-12">
          <TableOfContents />
          <main
            id={MAIN_CONTENT_ID}
            tabIndex={-1}
            className="w-full min-w-0 scroll-mt-8 outline-none"
          >
            <ArticleColumn />
          </main>
          <ArticleSidebar />
        </div>
      </div>
      <SiteFooter />
      <ArticleAudioPlayer />
    </div>
  );
}
