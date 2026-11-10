import type { StoredAudio } from "@/server/article-audio/ports";

function audioHeaders(file: StoredAudio): Headers {
  const headers = new Headers({
    "Content-Type": file.contentType,
    "Content-Length": String(file.contentLength),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  });
  if (file.contentRange) headers.set("Content-Range", file.contentRange);
  return headers;
}

function audioStatusCode(file: StoredAudio): number {
  return file.contentRange ? 206 : 200;
}

export function toAudioFileResponse(file: StoredAudio | null): Response {
  if (!file) return new Response(null, { status: 404 });

  return new Response(file.body, {
    status: audioStatusCode(file),
    headers: audioHeaders(file),
  });
}
