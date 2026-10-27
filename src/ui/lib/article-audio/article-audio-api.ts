export type AudioStatus = {
  status: "pending" | "processing" | "ready" | "failed";
  progress?: number;
  url?: string;
  error?: string;
};

function audioEndpoint(articleId: string): string {
  return `/api/articles/${encodeURIComponent(articleId)}/audio`;
}

async function readStatus(response: Response): Promise<AudioStatus> {
  if (!response.ok) {
    throw new Error(`Audio request failed (${response.status})`);
  }
  return response.json();
}

export async function requestAudio(
  articleId: string,
  signal: AbortSignal,
): Promise<AudioStatus> {
  const response = await fetch(audioEndpoint(articleId), {
    method: "POST",
    signal,
  });
  return readStatus(response);
}

export async function fetchAudioStatus(
  articleId: string,
  signal: AbortSignal,
): Promise<AudioStatus> {
  const response = await fetch(audioEndpoint(articleId), { signal });
  return readStatus(response);
}
