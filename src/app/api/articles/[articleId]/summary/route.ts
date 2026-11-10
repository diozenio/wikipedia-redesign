import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  isSummarizerConfigured,
  SummarizerNotConfiguredError,
} from "@/server/summary/openrouter-summarizer";
import { summarizeArticle } from "@/server/summary/summarize-article";

type Context = RouteContext<"/api/articles/[articleId]/summary">;

const MAX_TEXT_LENGTH = 6000;

const bodySchema = z.object({
  title: z.string().trim().min(1).max(300),
  text: z
    .string()
    .trim()
    .min(1)
    .transform((text) => text.slice(0, MAX_TEXT_LENGTH)),
});

function notConfigured(): Response {
  return Response.json({ error: "not_configured" }, { status: 503 });
}

export async function POST(request: NextRequest, ctx: Context) {
  const { articleId } = await ctx.params;

  if (!isSummarizerConfigured()) return notConfigured();

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const summary = await summarizeArticle(
      articleId,
      parsed.data.title,
      parsed.data.text,
    );
    return Response.json({ summary, source: "ai" });
  } catch (error) {
    if (error instanceof SummarizerNotConfiguredError) return notConfigured();
    console.error("Article summary failed", error);
    return Response.json({ error: "upstream_failed" }, { status: 502 });
  }
}
