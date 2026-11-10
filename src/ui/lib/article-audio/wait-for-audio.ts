import {
  type AudioStatus,
  fetchAudioStatus,
} from "@/ui/lib/article-audio/article-audio-api";

const POLL_INTERVAL_MS = 2_000;

function isInProgress(status: AudioStatus): boolean {
  return status.status === "pending" || status.status === "processing";
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

export async function waitForAudio(
  articleId: string,
  firstStatus: AudioStatus,
  onWaiting: (status: AudioStatus) => void,
  signal: AbortSignal,
): Promise<AudioStatus> {
  let status = firstStatus;

  while (isInProgress(status)) {
    onWaiting(status);
    await sleep(POLL_INTERVAL_MS, signal);
    status = await fetchAudioStatus(articleId, signal);
  }

  return status;
}
