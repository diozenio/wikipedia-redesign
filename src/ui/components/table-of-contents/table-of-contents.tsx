import { cn } from "@/ui/lib/utils";
import { Skeleton } from "@/ui/primitives/skeleton";

const entries = [
  { id: "inicio", active: true, indent: false, width: "w-12" },
  { id: "atividades", active: false, indent: false, width: "w-40" },
  { id: "evolucao", active: false, indent: false, width: "w-36" },
  { id: "antes-1940", active: false, indent: true, width: "w-24" },
  { id: "1940-1952", active: false, indent: true, width: "w-20" },
  { id: "1952-1964", active: false, indent: true, width: "w-20" },
  { id: "1964-1971", active: false, indent: true, width: "w-20" },
  { id: "1971-1981", active: false, indent: true, width: "w-20" },
  { id: "1981-atual", active: false, indent: true, width: "w-20" },
  { id: "vantagens", active: false, indent: false, width: "w-20" },
  { id: "uso-empresas", active: false, indent: false, width: "w-32" },
  { id: "administracao", active: false, indent: false, width: "w-32" },
  { id: "tipos-empresas", active: false, indent: false, width: "w-44" },
  { id: "classificacoes", active: false, indent: false, width: "w-28" },
  { id: "funcionamento", active: false, indent: false, width: "w-28" },
  { id: "dimensoes", active: false, indent: false, width: "w-24" },
  { id: "profissional", active: false, indent: false, width: "w-40" },
  { id: "etica-social", active: false, indent: false, width: "w-44" },
] as const;

const navItems = [
  { id: "pagina-principal", width: "w-28" },
  { id: "conteudo-destacado", width: "w-32" },
  { id: "eventos-atuais", width: "w-24" },
  { id: "pagina-aleatoria", width: "w-32" },
  { id: "doacao", width: "w-32" },
] as const;

export function TableOfContents() {
  return (
    <nav className="flex w-[232px] shrink-0 flex-col gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <ul className="flex flex-col gap-0.5 border-l border-border">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={cn(
              "rounded-r-md py-1.5 pr-3 pl-3",
              entry.active && "bg-accent",
              entry.indent && "pl-6.5",
            )}
          >
            <Skeleton className={cn("h-3.5", entry.width)} />
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2 py-1.5">
              <Skeleton className="size-3.5" />
              <Skeleton className={cn("h-3.5", item.width)} />
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
