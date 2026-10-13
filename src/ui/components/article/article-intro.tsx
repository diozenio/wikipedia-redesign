"use client";

import { RichText } from "@/ui/components/rich-text/rich-text";
import { useArticle } from "@/ui/contexts/article-context";

export function ArticleIntro() {
  const { introBlocks } = useArticle();

  return <RichText blocks={introBlocks} />;
}
