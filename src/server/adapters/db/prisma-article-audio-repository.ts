import type { ArticleAudio } from "@/server/article-audio/domain";
import type {
  ArticleAudioRepository,
  NewArticleAudio,
} from "@/server/article-audio/ports";
import type { Prisma, PrismaClient } from "@/server/generated/prisma/client";

function byContent(articleId: string, contentHash: string) {
  return { articleId_contentHash: { articleId, contentHash } };
}

export class PrismaArticleAudioRepository implements ArticleAudioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: string): Promise<ArticleAudio | null> {
    return this.prisma.articleAudio.findUnique({ where: { id } });
  }

  findByContent(
    articleId: string,
    contentHash: string,
  ): Promise<ArticleAudio | null> {
    return this.prisma.articleAudio.findUnique({
      where: byContent(articleId, contentHash),
    });
  }

  findLatestReady(articleId: string): Promise<ArticleAudio | null> {
    return this.prisma.articleAudio.findFirst({
      where: { articleId, status: "READY" },
      orderBy: { updatedAt: "desc" },
    });
  }

  async upsertPending(input: NewArticleAudio): Promise<ArticleAudio> {
    await this.resetFailed(input);
    return this.findOrCreate(input);
  }

  async markProcessing(id: string) {
    await this.update(id, { status: "PROCESSING", progress: 0, error: null });
  }

  async updateProgress(id: string, progress: number) {
    await this.update(id, { progress });
  }

  async markReady(id: string, storageKey: string, contentType: string) {
    await this.update(id, {
      status: "READY",
      progress: 100,
      storageKey,
      contentType,
      error: null,
    });
  }

  async markRetrying(id: string, error: string) {
    await this.update(id, { status: "PENDING", error });
  }

  async markFailed(id: string, error: string) {
    await this.update(id, { status: "FAILED", error });
  }

  private async resetFailed({ articleId, contentHash }: NewArticleAudio) {
    await this.prisma.articleAudio.updateMany({
      where: { articleId, contentHash, status: "FAILED" },
      data: { status: "PENDING", error: null },
    });
  }

  private findOrCreate(input: NewArticleAudio): Promise<ArticleAudio> {
    return this.prisma.articleAudio.upsert({
      where: byContent(input.articleId, input.contentHash),
      create: input,
      update: {},
    });
  }

  private async update(id: string, data: Prisma.ArticleAudioUpdateInput) {
    await this.prisma.articleAudio.update({ where: { id }, data });
  }
}
