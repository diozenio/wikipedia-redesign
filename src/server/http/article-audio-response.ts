import {
  type ArticleAudio,
  ArticleNotFoundError,
} from "@/server/article-audio/domain";

function audioFileUrl(articleId: string): string {
  return `/api/articles/${encodeURIComponent(articleId)}/audio/file`;
}

function readyResponse(audio: ArticleAudio): Response {
  return Response.json({ status: "ready", url: audioFileUrl(audio.articleId) });
}

function failedResponse(audio: ArticleAudio): Response {
  return Response.json({ status: "failed", error: audio.error });
}

function inProgressResponse(audio: ArticleAudio): Response {
  return Response.json(
    { status: audio.status.toLowerCase(), progress: audio.progress },
    { status: 202 },
  );
}

function notFoundResponse(message: string): Response {
  return Response.json({ error: message }, { status: 404 });
}

export function toAudioResponse(audio: ArticleAudio | null): Response {
  if (!audio) return notFoundResponse("Audio not requested yet");
  if (audio.status === "READY") return readyResponse(audio);
  if (audio.status === "FAILED") return failedResponse(audio);
  return inProgressResponse(audio);
}

export async function respondWithAudio(
  loadAudio: () => Promise<ArticleAudio | null>,
): Promise<Response> {
  try {
    return toAudioResponse(await loadAudio());
  } catch (error) {
    if (error instanceof ArticleNotFoundError) {
      return notFoundResponse(error.message);
    }
    throw error;
  }
}
