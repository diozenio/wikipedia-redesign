import type {
  ArticleAudio,
  ArticleAudioRequested,
} from "@/server/article-audio/domain";
import type { ArticleData } from "@/ui/components/article/types";

export type PcmAudio = {
  samples: Int16Array;
  sampleRate: number;
};

export interface SpeechSynthesizer {
  readonly voiceId: string;
  synthesize(text: string): Promise<PcmAudio>;
}

export type EncodedAudio = {
  audio: Uint8Array;
  contentType: string;
  extension: string;
};

export interface AudioEncoder {
  encode(pcm: PcmAudio): Promise<EncodedAudio>;
}

export type StoredAudio = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength: number;
  contentRange?: string;
};

export interface AudioStorage {
  put(key: string, audio: Uint8Array, contentType: string): Promise<void>;
  get(key: string, range?: string): Promise<StoredAudio | null>;
}

export type NewArticleAudio = {
  articleId: string;
  contentHash: string;
  voice: string;
};

export interface ArticleAudioRepository {
  findById(id: string): Promise<ArticleAudio | null>;
  findByContent(
    articleId: string,
    contentHash: string,
  ): Promise<ArticleAudio | null>;
  findLatestReady(articleId: string): Promise<ArticleAudio | null>;
  upsertPending(input: NewArticleAudio): Promise<ArticleAudio>;
  markProcessing(id: string): Promise<void>;
  updateProgress(id: string, progress: number): Promise<void>;
  markReady(id: string, storageKey: string, contentType: string): Promise<void>;
  markRetrying(id: string, error: string): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
}

export type JobAttempt = { isFinal: boolean };

export type AudioJobHandler = (
  event: ArticleAudioRequested,
  attempt: JobAttempt,
) => Promise<void>;

export type AudioJobConsumer = { close(): Promise<void> };

export interface AudioJobQueue {
  enqueue(event: ArticleAudioRequested): Promise<void>;
  consume(handler: AudioJobHandler): AudioJobConsumer;
}

export interface ArticleSource {
  getById(articleId: string): Promise<ArticleData | null>;
}
