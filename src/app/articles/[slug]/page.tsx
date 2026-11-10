import type { Metadata } from "next";
import { ArticlePageLayout } from "@/ui/layouts/article-page-layout";
import { ArticlePageLoadingLayout } from "@/ui/layouts/article-page-loading-layout";
import { EmptyLayout } from "@/ui/layouts/empty-layout";
import { AppProvider } from "@/ui/providers/app-provider";
import { ArticleAudioProvider } from "@/ui/providers/article-audio-provider";
import { ArticleErrorProvider } from "@/ui/providers/article-error-provider";
import { ArticleNotFoundProvider } from "@/ui/providers/article-not-found-provider";
import { MediaWikiArticleProvider } from "@/ui/providers/mediawiki-article-provider";
import { MediaWikiSearchProvider } from "@/ui/providers/mediawiki-search-provider";
import { MediaWikiSeeAlsoProvider } from "@/ui/providers/mediawiki-see-also-provider";

function decodeArticleKey(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: decodeArticleKey(slug).replaceAll("_", " ") };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;

  return (
    <AppProvider>
      <MediaWikiSearchProvider>
        <MediaWikiArticleProvider
          slug={decodeArticleKey(slug)}
          fallback={<ArticlePageLoadingLayout />}
          notFound={
            <ArticleNotFoundProvider>
              <EmptyLayout />
            </ArticleNotFoundProvider>
          }
          error={
            <ArticleErrorProvider>
              <EmptyLayout />
            </ArticleErrorProvider>
          }
        >
          <ArticleAudioProvider>
            <MediaWikiSeeAlsoProvider>
              <ArticlePageLayout />
            </MediaWikiSeeAlsoProvider>
          </ArticleAudioProvider>
        </MediaWikiArticleProvider>
      </MediaWikiSearchProvider>
    </AppProvider>
  );
}
