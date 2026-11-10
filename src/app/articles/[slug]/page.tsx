import type { Metadata } from "next";
import { ArticlePageLayout } from "@/ui/layouts/article-page-layout";
import { ArticlePageLoadingLayout } from "@/ui/layouts/article-page-loading-layout";
import { EmptyLayout } from "@/ui/layouts/empty-layout";
import { AppProvider } from "@/ui/providers/app-provider";
import { ArticleErrorProvider } from "@/ui/providers/article-error-provider";
import { ArticleNotFoundProvider } from "@/ui/providers/article-not-found-provider";
import {
  ArticleAudioProvider,
  ArticleProvider,
  ArticleSummaryProvider,
  SearchProvider,
  SeeAlsoProvider,
} from "@/ui/providers/data-providers";

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
      <SearchProvider>
        <ArticleProvider
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
            <ArticleSummaryProvider>
              <SeeAlsoProvider>
                <ArticlePageLayout />
              </SeeAlsoProvider>
            </ArticleSummaryProvider>
          </ArticleAudioProvider>
        </ArticleProvider>
      </SearchProvider>
    </AppProvider>
  );
}
