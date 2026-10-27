import { type Job, type JobsOptions, Queue, Worker } from "bullmq";
import { createRedisClient } from "@/server/adapters/queue/redis-connection";
import type { ArticleAudioRequested } from "@/server/article-audio/domain";
import type {
  AudioJobConsumer,
  AudioJobHandler,
  AudioJobQueue,
  JobAttempt,
} from "@/server/article-audio/ports";

const QUEUE_NAME = "article-audio";
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5_000;

type AudioJob = Job<ArticleAudioRequested>;

function jobId(event: ArticleAudioRequested): string {
  return `${event.articleId}-${event.contentHash}`;
}

function jobOptions(event: ArticleAudioRequested): JobsOptions {
  return {
    jobId: jobId(event),
    attempts: MAX_ATTEMPTS,
    backoff: { type: "exponential", delay: RETRY_DELAY_MS },
    removeOnComplete: true,
    removeOnFail: true,
  };
}

function attemptOf(job: AudioJob): JobAttempt {
  const maxAttempts = job.opts.attempts ?? 1;
  return { isFinal: job.attemptsMade + 1 >= maxAttempts };
}

function logJobEvents(worker: Worker<ArticleAudioRequested>) {
  worker.on("active", (job) => console.info(`[audio] started ${job.id}`));
  worker.on("completed", (job) => console.info(`[audio] ready ${job.id}`));
  worker.on("failed", (job, error) =>
    console.error(`[audio] failed ${job?.id}: ${error.message}`),
  );
}

export class BullMQAudioJobQueue implements AudioJobQueue {
  private queue?: Queue<ArticleAudioRequested>;

  constructor(private readonly redisUrl: string) {}

  async enqueue(event: ArticleAudioRequested) {
    await this.getQueue().add(event.type, event, jobOptions(event));
  }

  consume(handler: AudioJobHandler): AudioJobConsumer {
    const worker = new Worker<ArticleAudioRequested>(
      QUEUE_NAME,
      (job) => handler(job.data, attemptOf(job)),
      { connection: createRedisClient(this.redisUrl) },
    );
    logJobEvents(worker);
    return worker;
  }

  private getQueue(): Queue<ArticleAudioRequested> {
    this.queue ??= new Queue(QUEUE_NAME, {
      connection: createRedisClient(this.redisUrl),
    });
    return this.queue;
  }
}
