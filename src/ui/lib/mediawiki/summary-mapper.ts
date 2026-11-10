import type { ArticleSummaryData } from "@/ui/components/article/types";
import { toArticleKey } from "@/ui/lib/mediawiki/article-mapper";
import type {
  MediaWikiGeneratorPage,
  MediaWikiGeneratorResponse,
} from "@/ui/lib/mediawiki/types";

function mapGeneratorPage(page: MediaWikiGeneratorPage): ArticleSummaryData {
  return {
    id: String(page.pageid),
    slug: toArticleKey(page.title),
    title: page.title,
    description: page.description ?? null,
    excerpt: page.extract ?? null,
    thumbnail: page.thumbnail
      ? {
          src: page.thumbnail.source,
          width: page.thumbnail.width,
          height: page.thumbnail.height,
        }
      : null,
  };
}

export function mapMediaWikiGeneratorToSummaries(
  response: MediaWikiGeneratorResponse,
): ArticleSummaryData[] {
  return Object.values(response.query?.pages ?? {})
    .sort((a, b) => a.index - b.index)
    .map(mapGeneratorPage);
}
