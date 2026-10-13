import { ArticleBreadcrumb } from "@/ui/components/article/article-breadcrumb";
import { ArticleDataTable } from "@/ui/components/article/article-data-table";
import { ArticleHeader } from "@/ui/components/article/article-header";
import { ArticleIntro } from "@/ui/components/article/article-intro";
import { ArticleProcessCards } from "@/ui/components/article/article-process-cards";
import { ArticleSection } from "@/ui/components/article/article-section";
import { ArticleTimeline } from "@/ui/components/article/article-timeline";
import { ArticleToolbar } from "@/ui/components/article/article-toolbar";
import { Separator } from "@/ui/primitives/separator";
import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticleColumn() {
  return (
    <div className="flex w-full flex-col gap-6">
      <ArticleBreadcrumb />
      <ArticleToolbar />
      <ArticleHeader />
      <Separator />
      <ArticleIntro />
      <ArticleSection titleWidth="w-56">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </ArticleSection>
      <ArticleSection titleWidth="w-48">
        <ArticleTimeline />
      </ArticleSection>
      <ArticleSection titleWidth="w-44">
        <Skeleton className="h-4 w-3/4" />
        <ArticleProcessCards />
      </ArticleSection>
      <ArticleSection titleWidth="w-64">
        <ArticleDataTable />
      </ArticleSection>
    </div>
  );
}
