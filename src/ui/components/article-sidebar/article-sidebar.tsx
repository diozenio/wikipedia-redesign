import { LanguagesCard } from "@/ui/components/article-sidebar/languages-card";
import { SeeAlsoCard } from "@/ui/components/article-sidebar/see-also-card";
import { SummaryCard } from "@/ui/components/article-sidebar/summary-card";
import { ToolsCard } from "@/ui/components/article-sidebar/tools-card";

export function ArticleSidebar() {
  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4">
      <SummaryCard />
      <ToolsCard />
      <LanguagesCard />
      <SeeAlsoCard />
    </aside>
  );
}
