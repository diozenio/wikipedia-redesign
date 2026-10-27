import type {
  ArticleAudioRepository,
  AudioStorage,
  StoredAudio,
} from "@/server/article-audio/ports";

type Dependencies = {
  repository: ArticleAudioRepository;
  storage: AudioStorage;
};

export async function getArticleAudioFile(
  { repository, storage }: Dependencies,
  articleId: string,
  range?: string,
): Promise<StoredAudio | null> {
  const audio = await repository.findLatestReady(articleId);
  if (!audio?.storageKey) return null;

  return storage.get(audio.storageKey, range);
}
