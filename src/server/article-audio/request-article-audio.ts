import type { ArticleAudio } from "@/server/article-audio/domain";
import { loadArticleNarration } from "@/server/article-audio/load-article-narration";
import type {
  ArticleAudioRepository,
  ArticleSource,
  AudioJobQueue,
  SpeechSynthesizer,
} from "@/server/article-audio/ports";

type Dependencies = {
  articles: ArticleSource;
  repository: ArticleAudioRepository;
  queue: AudioJobQueue;
  synthesizer: SpeechSynthesizer;
};

function isReusable(audio: ArticleAudio | null): audio is ArticleAudio {
  return audio !== null && audio.status !== "FAILED";
}

async function enqueueIfPending(queue: AudioJobQueue, audio: ArticleAudio) {
  if (audio.status !== "PENDING") return;

  await queue.enqueue({
    type: "article-audio.requested",
    audioId: audio.id,
    articleId: audio.articleId,
    contentHash: audio.contentHash,
  });
}

async function createAndEnqueue(
  { repository, queue, synthesizer }: Dependencies,
  articleId: string,
  contentHash: string,
): Promise<ArticleAudio> {
  const audio = await repository.upsertPending({
    articleId,
    contentHash,
    voice: synthesizer.voiceId,
  });
  await enqueueIfPending(queue, audio);
  return audio;
}

export async function requestArticleAudio(
  dependencies: Dependencies,
  articleId: string,
): Promise<ArticleAudio> {
  const { contentHash } = await loadArticleNarration(dependencies, articleId);
  const existing = await dependencies.repository.findByContent(
    articleId,
    contentHash,
  );

  if (isReusable(existing)) return existing;
  return createAndEnqueue(dependencies, articleId, contentHash);
}
