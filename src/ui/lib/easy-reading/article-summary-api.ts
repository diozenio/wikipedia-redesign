export type ArticleSummaryResult =
  | { status: "ready"; summary: string }
  | { status: "unavailable"; reason: "not_configured" | "error" };

function summaryEndpoint(articleId: string): string {
  return `/api/articles/${encodeURIComponent(articleId)}/summary`;
}

export async function fetchArticleSummary(
  articleId: string,
  input: { title: string; text: string },
  signal: AbortSignal,
): Promise<ArticleSummaryResult> {
  const response = await fetch(summaryEndpoint(articleId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (response.status === 503) {
    return { status: "unavailable", reason: "not_configured" };
  }
  if (!response.ok) return { status: "unavailable", reason: "error" };

  const data: { summary?: unknown } = await response.json();
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    return { status: "unavailable", reason: "error" };
  }

  return { status: "ready", summary: data.summary.trim() };
}
