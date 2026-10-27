import type { ArticleAudio } from "@/server/article-audio/domain";
import { loadArticleNarration } from "@/server/article-audio/load-article-narration";
import type {
  ArticleAudioRepository,
  ArticleSource,
  SpeechSynthesizer,
} from "@/server/article-audio/ports";

type Dependencies = {
  articles: ArticleSource;
  repository: ArticleAudioRepository;
  synthesizer: SpeechSynthesizer;
};

export async function getArticleAudioStatus(
  dependencies: Dependencies,
  articleId: string,
): Promise<ArticleAudio | null> {
  const { contentHash } = await loadArticleNarration(dependencies, articleId);
  return dependencies.repository.findByContent(articleId, contentHash);
}
