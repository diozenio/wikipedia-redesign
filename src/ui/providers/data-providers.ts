import { ApiArticleSummaryProvider } from "@/ui/providers/api-article-summary-provider";
import { ArticleAudioProvider as ApiArticleAudioProvider } from "@/ui/providers/article-audio-provider";
import { MediaWikiArticleProvider } from "@/ui/providers/mediawiki-article-provider";
import { MediaWikiFeaturedArticlesProvider } from "@/ui/providers/mediawiki-featured-articles-provider";
import { MediaWikiSearchProvider } from "@/ui/providers/mediawiki-search-provider";
import { MediaWikiSeeAlsoProvider } from "@/ui/providers/mediawiki-see-also-provider";
import { MockArticleAudioProvider } from "@/ui/providers/mocks/mock-article-audio-provider";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";
import { MockFeaturedArticlesProvider } from "@/ui/providers/mocks/mock-featured-articles-provider";
import { MockSearchProvider } from "@/ui/providers/mocks/mock-search-provider";
import { MockSeeAlsoProvider } from "@/ui/providers/mocks/mock-see-also-provider";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const ArticleProvider = useMocks
  ? MockArticleProvider
  : MediaWikiArticleProvider;

export const SearchProvider = useMocks
  ? MockSearchProvider
  : MediaWikiSearchProvider;

export const SeeAlsoProvider = useMocks
  ? MockSeeAlsoProvider
  : MediaWikiSeeAlsoProvider;

export const FeaturedArticlesProvider = useMocks
  ? MockFeaturedArticlesProvider
  : MediaWikiFeaturedArticlesProvider;

export const ArticleAudioProvider = useMocks
  ? MockArticleAudioProvider
  : ApiArticleAudioProvider;

export const ArticleSummaryProvider = ApiArticleSummaryProvider;
