import { Database, FileDown, Link, Printer, Quote, Wrench } from "lucide-react";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { cn, focusRing } from "@/ui/lib/utils";

const tools = [
  { label: "Citar esta página", icon: Quote },
  { label: "Baixar como PDF", icon: FileDown },
  { label: "Versão para impressão", icon: Printer },
  { label: "Link permanente", icon: Link },
  { label: "Item no Wikidata", icon: Database },
];

export function ToolsCard() {
  return (
    <SidebarCard icon={Wrench} title="Ferramentas">
      <ul className="flex flex-col gap-1 px-5 pb-4">
        {tools.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md p-2 text-left hover:bg-muted",
                focusRing,
              )}
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </SidebarCard>
  );
}
