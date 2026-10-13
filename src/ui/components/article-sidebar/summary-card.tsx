import { Info } from "lucide-react";

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
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Info className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Resumo rápido
        </span>
      </div>
      <div className="flex flex-col px-5 pb-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-t border-border py-2.5"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {row.label}
            </span>
            <span className="text-sm leading-[1.4] text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
