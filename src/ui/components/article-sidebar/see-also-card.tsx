import { Compass, CornerDownRight } from "lucide-react";

const items = [
  "Tecnologia da informação",
  "Banco de dados",
  "Gestão do conhecimento",
  "Engenharia de software",
];

export function SeeAlsoCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Compass className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Ver também
        </span>
      </div>
      <div className="flex flex-col px-5 pb-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 py-1.5">
            <CornerDownRight className="size-3.5 text-muted-foreground" />
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
