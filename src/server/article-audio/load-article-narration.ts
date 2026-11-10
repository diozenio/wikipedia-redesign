import { ArticleNotFoundError } from "@/server/article-audio/domain";
import {
  buildNarration,
  hashNarration,
} from "@/server/article-audio/narration";
import type {
  ArticleSource,
  SpeechSynthesizer,
} from "@/server/article-audio/ports";

type Dependencies = {
  articles: ArticleSource;
  synthesizer: SpeechSynthesizer;
};

export type ArticleNarration = {
  narration: string;
  contentHash: string;
};

export async function loadArticleNarration(
  { articles, synthesizer }: Dependencies,
  articleId: string,
): Promise<ArticleNarration> {
  const article = await articles.getById(articleId);
  if (!article) throw new ArticleNotFoundError(articleId);

  const narration = buildNarration(article);
  const contentHash = hashNarration(narration, synthesizer.voiceId);
  return { narration, contentHash };
}
