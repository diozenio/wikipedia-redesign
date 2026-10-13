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
