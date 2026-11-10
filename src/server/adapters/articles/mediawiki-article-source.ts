import { parseHTML } from "linkedom";
import type { ArticleSource } from "@/server/article-audio/ports";
import type { ArticleData } from "@/ui/components/article/types";
import {
  fetchMediaWikiHtml,
  fetchMediaWikiPageById,
  MediaWikiNotFoundError,
} from "@/ui/lib/mediawiki/api";
import { mapMediaWikiArticleToDomain } from "@/ui/lib/mediawiki/article-mapper";
import { parseParsoidSections } from "@/ui/lib/mediawiki/parsoid-sections";

const USER_AGENT = "wikipedia-redesign/0.1 (article audio)";

export class MediaWikiArticleSource implements ArticleSource {
  private readonly options = { headers: { "User-Agent": USER_AGENT } };

  async getById(articleId: string): Promise<ArticleData | null> {
    if (!/^\d+$/.test(articleId)) return null;

    try {
      const page = await fetchMediaWikiPageById(articleId, this.options);
      const html = await fetchMediaWikiHtml(page.title, this.options);
      const { document } = parseHTML(html);
      return mapMediaWikiArticleToDomain(
        page,
        parseParsoidSections(document as unknown as Document),
      );
    } catch (error) {
      if (error instanceof MediaWikiNotFoundError) return null;
      throw error;
    }
  }
}
