import { CachingArticleSource } from "@/server/adapters/articles/caching-article-source";
import { MediaWikiArticleSource } from "@/server/adapters/articles/mediawiki-article-source";
import { PrismaArticleAudioRepository } from "@/server/adapters/db/prisma-article-audio-repository";
import { LameMp3Encoder } from "@/server/adapters/encoding/lame-mp3-encoder";
import { BullMQAudioJobQueue } from "@/server/adapters/queue/bullmq-audio-job-queue";
import {
  S3AudioStorage,
  type S3StorageOptions,
} from "@/server/adapters/storage/s3-audio-storage";
import {
  type OpenAICompatibleOptions,
  OpenAICompatibleSpeechSynthesizer,
} from "@/server/adapters/tts/openai-compatible-speech-synthesizer";
import type {
  ArticleAudioRepository,
  ArticleSource,
  AudioEncoder,
  AudioJobQueue,
  AudioStorage,
  SpeechSynthesizer,
} from "@/server/article-audio/ports";
import { getPrisma } from "@/server/db";
import { type Env, getEnv } from "@/server/env";

const ARTICLE_CACHE_TTL_MS = 5 * 60_000;

export type Container = {
  articles: ArticleSource;
  repository: ArticleAudioRepository;
  queue: AudioJobQueue;
  storage: AudioStorage;
  synthesizer: SpeechSynthesizer;
  encoder: AudioEncoder;
};

function s3Options(env: Env): S3StorageOptions {
  return {
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
    bucket: env.S3_BUCKET,
  };
}

function ttsOptions(env: Env): OpenAICompatibleOptions {
  return {
    baseUrl: env.TTS_BASE_URL,
    apiKey: env.TTS_API_KEY,
    model: env.TTS_MODEL,
    voice: env.TTS_VOICE,
    sampleRate: env.TTS_SAMPLE_RATE,
  };
}

function createContainer(env: Env): Container {
  return {
    articles: new CachingArticleSource(
      new MediaWikiArticleSource(),
      ARTICLE_CACHE_TTL_MS,
    ),
    repository: new PrismaArticleAudioRepository(getPrisma()),
    queue: new BullMQAudioJobQueue(env.REDIS_URL),
    storage: new S3AudioStorage(s3Options(env)),
    synthesizer: new OpenAICompatibleSpeechSynthesizer(ttsOptions(env)),
    encoder: new LameMp3Encoder(env.MP3_BITRATE),
  };
}

const globalForContainer = globalThis as unknown as { container?: Container };

export function getContainer(): Container {
  globalForContainer.container ??= createContainer(getEnv());
  return globalForContainer.container;
}
