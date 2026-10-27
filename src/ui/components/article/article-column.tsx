"use client";

import { ArticleBreadcrumb } from "@/ui/components/article/article-breadcrumb";
import { ArticleHeader } from "@/ui/components/article/article-header";
import { ArticleIntro } from "@/ui/components/article/article-intro";
import { ArticleSection } from "@/ui/components/article/article-section";
import { ArticleToolbar } from "@/ui/components/article/article-toolbar";
import { RichText } from "@/ui/components/rich-text/rich-text";
import { useArticle } from "@/ui/contexts/article-context";
import { Separator } from "@/ui/primitives/separator";

export function ArticleColumn() {
  const { sections } = useArticle();

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <ArticleBreadcrumb />
      <ArticleToolbar />
      <div id="inicio" className="flex scroll-mt-8 flex-col gap-6">
        <ArticleHeader />
        <Separator />
        <ArticleIntro />
      </div>
      {sections.map((section) => (
        <ArticleSection key={section.id} id={section.id} title={section.title}>
          <RichText blocks={section.blocks} />
        </ArticleSection>
      ))}
    </div>
  );
}
