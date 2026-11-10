import type { NextRequest } from "next/server";
import { getArticleAudioFile } from "@/server/article-audio/get-article-audio-file";
import { getContainer } from "@/server/container";
import { toAudioFileResponse } from "@/server/http/audio-file-response";

type Context = RouteContext<"/api/articles/[articleId]/audio/file">;

export async function GET(request: NextRequest, ctx: Context) {
  const { articleId } = await ctx.params;
  const range = request.headers.get("range") ?? undefined;

  const file = await getArticleAudioFile(getContainer(), articleId, range);
  return toAudioFileResponse(file);
}
