import type { RichTextBlock } from "@/ui/components/rich-text/types";

export type ArticleBreadcrumbItem = { label: string };

export type ArticleSubsection = { id: string; title: string };

export type ArticleSectionData = {
  id: string;
  title: string;
  subsections: ArticleSubsection[];
  blocks: RichTextBlock[];
};

export type ArticleImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type ArticleInfobox = {
  caption: string | null;
  image: ArticleImage | null;
  rows: { label: string; value: string }[];
};

export type ArticleLanguage = {
  code: string;
  name: string;
  autonym: string;
  url: string;
};

export type ArticleData = {
  id: string;
  slug: string;
  breadcrumb: ArticleBreadcrumbItem[];
  title: string;
  origin: string;
  sourceUrl: string;
  revisionId: number | null;
  badges: string[];
  meta: {
    languages: number;
    lastEditedAt: string | null;
    lastEditedLabel: string;
    watchersLabel: string;
  };
  infobox: ArticleInfobox | null;
  languages: ArticleLanguage[];
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
