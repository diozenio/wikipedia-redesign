import type { RichTextBlock } from "@/ui/components/rich-text/types";

export type ArticleBreadcrumbItem = { label: string };

export type ArticleSubsection = { id: string; title: string };

export type ArticleSectionData = {
  id: string;
  title: string;
  subsections: ArticleSubsection[];
  blocks: RichTextBlock[];
};

export type ArticleData = {
  id: string;
  slug: string;
  breadcrumb: ArticleBreadcrumbItem[];
  title: string;
  origin: string;
  badges: string[];
  meta: {
    languages: number;
    lastEditedLabel: string;
    watchersLabel: string;
  };
  introBlocks: RichTextBlock[];
  sections: ArticleSectionData[];
};

export type ArticleSummaryData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  thumbnail: { src: string; width: number; height: number } | null;
};
