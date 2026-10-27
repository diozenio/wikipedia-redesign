import type { ArticleSource } from "@/server/article-audio/ports";
import type { ArticleData } from "@/ui/components/article/types";

type CacheEntry = {
  expiresAt: number;
  article: Promise<ArticleData | null>;
};

export class CachingArticleSource implements ArticleSource {
  private readonly entries = new Map<string, CacheEntry>();

  constructor(
    private readonly source: ArticleSource,
    private readonly ttlMs: number,
  ) {}

  getById(articleId: string): Promise<ArticleData | null> {
    const now = Date.now();
    const cached = this.entries.get(articleId);
    if (cached && cached.expiresAt > now) return cached.article;

    const article = this.source.getById(articleId);
    this.entries.set(articleId, { expiresAt: now + this.ttlMs, article });
    article.catch(() => this.entries.delete(articleId));
    return article;
  }
}
