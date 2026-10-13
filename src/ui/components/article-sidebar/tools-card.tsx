import { Database, FileDown, Link, Printer, Quote, Wrench } from "lucide-react";

const tools = [
  { label: "Citar esta página", icon: Quote },
  { label: "Baixar como PDF", icon: FileDown },
  { label: "Versão para impressão", icon: Printer },
  { label: "Link permanente", icon: Link },
  { label: "Item no Wikidata", icon: Database },
];

export function ToolsCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Wrench className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Ferramentas
        </span>
      </div>
      <div className="flex flex-col gap-1 px-5 pb-4">
        {tools.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2.5 rounded-md p-2">
            <Icon className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
