import type { ArticleSource } from "@/server/article-audio/ports";
import type { ArticleData } from "@/ui/components/article/types";
import { findMockArticleById } from "@/ui/providers/mocks/mock-article";

export class MockArticleSource implements ArticleSource {
  async getById(articleId: string): Promise<ArticleData | null> {
    return findMockArticleById(articleId);
  }
}
