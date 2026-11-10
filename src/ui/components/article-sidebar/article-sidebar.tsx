import { LanguagesCard } from "@/ui/components/article-sidebar/languages-card";
import { SeeAlsoCard } from "@/ui/components/article-sidebar/see-also-card";
import { SummaryCard } from "@/ui/components/article-sidebar/summary-card";
import { ToolsCard } from "@/ui/components/article-sidebar/tools-card";

export function ArticleSidebar() {
  return (
    <aside className="grid w-full grid-cols-1 items-start gap-4 @min-[40rem]/page:grid-cols-2 @min-[64rem]/page:grid-cols-1">
      <SummaryCard />
      <ToolsCard />
      <LanguagesCard />
      <SeeAlsoCard />
    </aside>
  );
}
