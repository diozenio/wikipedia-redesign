import { Info } from "lucide-react";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";

const rows = [
  { label: "Área", value: "Ciência da computação" },
  {
    label: "Componentes",
    value: "Hardware, software, redes, bancos de dados e pessoas",
  },
  {
    label: "Funções",
    value: "Coletar, processar, armazenar e distribuir informação",
  },
  { label: "Apoia", value: "Planejamento, controle, análise e decisão" },
];

export function SummaryCard() {
  return (
    <SidebarCard icon={Info} title="Resumo rápido">
      <dl className="flex flex-col px-5 pb-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-t border-border py-2.5"
          >
            <dt className="text-xs font-medium text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-sm leading-[1.4] text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </SidebarCard>
  );
}
