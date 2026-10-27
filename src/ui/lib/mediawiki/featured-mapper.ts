import type {
  FeaturedArticleData,
  FeaturedFeedData,
} from "@/ui/components/home/types";
import type {
  MediaWikiFeaturedFeed,
  MediaWikiFeedArticle,
} from "@/ui/lib/mediawiki/types";

const MAX_FEATURED_ARTICLES = 7;

function mapFeedArticle(article: MediaWikiFeedArticle): FeaturedArticleData {
  return {
    slug: article.titles.canonical,
    title: article.titles.normalized,
    description: article.description ?? null,
    excerpt: article.extract,
    thumbnail: article.thumbnail
      ? {
          src: article.thumbnail.source,
          width: article.thumbnail.width,
          height: article.thumbnail.height,
        }
      : null,
    views: article.views ?? null,
  };
}

export function mapMediaWikiFeaturedFeedToDomain(
  feed: MediaWikiFeaturedFeed,
  date: string,
): FeaturedFeedData {
  const candidates = [
    ...(feed.tfa ? [feed.tfa] : []),
    ...(feed.mostread?.articles ?? []),
  ].filter((article) => article.type === "standard");

  const seen = new Set<number>();
  const articles = candidates
    .filter((article) => {
      if (seen.has(article.pageid)) return false;
      seen.add(article.pageid);
      return true;
    })
    .slice(0, MAX_FEATURED_ARTICLES)
    .map(mapFeedArticle);

  return { date, articles };
}
