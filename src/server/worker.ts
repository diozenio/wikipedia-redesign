import { generateArticleAudio } from "@/server/article-audio/generate-article-audio";
import type { AudioJobConsumer } from "@/server/article-audio/ports";
import { getContainer } from "@/server/container";

function startWorker(): AudioJobConsumer {
  const container = getContainer();
  return container.queue.consume((event, attempt) =>
    generateArticleAudio(container, event, attempt),
  );
}

function stopOnSignals(consumer: AudioJobConsumer) {
  const stop = async () => {
    await consumer.close();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

stopOnSignals(startWorker());
console.info("[audio] worker listening for article-audio.requested");
