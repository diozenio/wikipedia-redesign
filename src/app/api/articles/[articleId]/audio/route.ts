import type { NextRequest } from "next/server";
import { getArticleAudioStatus } from "@/server/article-audio/get-article-audio-status";
import { requestArticleAudio } from "@/server/article-audio/request-article-audio";
import { getContainer } from "@/server/container";
import { respondWithAudio } from "@/server/http/article-audio-response";

type Context = RouteContext<"/api/articles/[articleId]/audio">;

export async function GET(_request: NextRequest, ctx: Context) {
  const { articleId } = await ctx.params;
  return respondWithAudio(() =>
    getArticleAudioStatus(getContainer(), articleId),
  );
}

export async function POST(_request: NextRequest, ctx: Context) {
  const { articleId } = await ctx.params;
  return respondWithAudio(() => requestArticleAudio(getContainer(), articleId));
}
