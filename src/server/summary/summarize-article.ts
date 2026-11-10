import { createHash } from "node:crypto";
import { summarizeWithOpenRouter } from "@/server/summary/openrouter-summarizer";

const MAX_CACHE_ENTRIES = 500;
const cache = new Map<string, Promise<string>>();

function cacheKey(articleId: string, title: string, text: string): string {
  const hash = createHash("sha256").update(`${title}\n${text}`).digest("hex");
  return `${articleId}:${hash}`;
}

export function summarizeArticle(
  articleId: string,
  title: string,
  text: string,
): Promise<string> {
  const key = cacheKey(articleId, title, text);
  const cached = cache.get(key);
  if (cached) return cached;

  const summary = summarizeWithOpenRouter(title, text);
  cache.set(key, summary);
  summary.catch(() => cache.delete(key));

  if (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }

  return summary;
}
