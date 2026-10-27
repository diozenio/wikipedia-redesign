"use client";

import type { ReactNode } from "react";
import { ArticleContext } from "@/ui/contexts/article-context";
import {
  findMockArticleBySlug,
  mockArticle,
} from "@/ui/providers/mocks/mock-article";

type MockArticleProviderProps = {
  slug?: string;
  notFound?: ReactNode;
  children: ReactNode;
};

export function MockArticleProvider({
  slug,
  notFound = null,
  children,
}: MockArticleProviderProps) {
  const article = slug ? findMockArticleBySlug(slug) : mockArticle;

  if (!article) return notFound;

  return <ArticleContext value={article}>{children}</ArticleContext>;
}
