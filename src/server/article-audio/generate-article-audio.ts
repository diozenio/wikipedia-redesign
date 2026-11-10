import {
  type ArticleAudio,
  type ArticleAudioRequested,
  ArticleChangedError,
} from "@/server/article-audio/domain";
import { synthesisProgress } from "@/server/article-audio/generation-progress";
import { loadArticleNarration } from "@/server/article-audio/load-article-narration";
import { concatPcm } from "@/server/article-audio/pcm";
import type {
  ArticleAudioRepository,
  ArticleSource,
  AudioEncoder,
  AudioStorage,
  JobAttempt,
  PcmAudio,
  SpeechSynthesizer,
} from "@/server/article-audio/ports";
import { splitNarration } from "@/server/article-audio/split-narration";

type Dependencies = {
  articles: ArticleSource;
  repository: ArticleAudioRepository;
  storage: AudioStorage;
  synthesizer: SpeechSynthesizer;
  encoder: AudioEncoder;
};

type StoredFile = { storageKey: string; contentType: string };

function needsGeneration(audio: ArticleAudio | null): audio is ArticleAudio {
  return audio !== null && audio.status !== "READY";
}

function buildStorageKey(event: ArticleAudioRequested, extension: string) {
  return `articles/${event.articleId}/${event.contentHash}.${extension}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function loadCurrentNarration(
  dependencies: Dependencies,
  event: ArticleAudioRequested,
): Promise<string> {
  const { narration, contentHash } = await loadArticleNarration(
    dependencies,
    event.articleId,
  );
  if (contentHash !== event.contentHash) {
    throw new ArticleChangedError(event.articleId);
  }
  return narration;
}

async function synthesizeChunks(
  { synthesizer, repository }: Dependencies,
  audioId: string,
  chunks: string[],
): Promise<PcmAudio[]> {
  const parts: PcmAudio[] = [];

  for (const chunk of chunks) {
    parts.push(await synthesizer.synthesize(chunk));
    const progress = synthesisProgress(parts.length, chunks.length);
    await repository.updateProgress(audioId, progress);
  }

  return parts;
}

async function synthesizeAndStore(
  dependencies: Dependencies,
  audioId: string,
  event: ArticleAudioRequested,
): Promise<StoredFile> {
  const narration = await loadCurrentNarration(dependencies, event);
  const chunks = splitNarration(narration);
  const parts = await synthesizeChunks(dependencies, audioId, chunks);
  const encoded = await dependencies.encoder.encode(concatPcm(parts));
  const storageKey = buildStorageKey(event, encoded.extension);

  await dependencies.storage.put(
    storageKey,
    encoded.audio,
    encoded.contentType,
  );
  return { storageKey, contentType: encoded.contentType };
}

async function recordFailure(
  repository: ArticleAudioRepository,
  audioId: string,
  attempt: JobAttempt,
  error: unknown,
) {
  const message = errorMessage(error);

  if (attempt.isFinal) {
    await repository.markFailed(audioId, message);
  } else {
    await repository.markRetrying(audioId, message);
  }
}

export async function generateArticleAudio(
  dependencies: Dependencies,
  event: ArticleAudioRequested,
  attempt: JobAttempt,
): Promise<void> {
  const { repository } = dependencies;
  const audio = await repository.findById(event.audioId);
  if (!needsGeneration(audio)) return;

  await repository.markProcessing(audio.id);

  try {
    const file = await synthesizeAndStore(dependencies, audio.id, event);
    await repository.markReady(audio.id, file.storageKey, file.contentType);
  } catch (error) {
    await recordFailure(repository, audio.id, attempt, error);
    throw error;
  }
}
