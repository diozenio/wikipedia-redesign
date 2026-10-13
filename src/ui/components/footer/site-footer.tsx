import { BookOpen } from "lucide-react";

const columns = [
  {
    title: "Sobre",
    links: [
      "Sobre a Wikipédia",
      "Portal comunitário",
      "Página de boas-vindas",
      "Contato",
    ],
  },
  {
    title: "Comunidade",
    links: [
      "Alterações recentes",
      "Página de testes",
      "Café dos novatos",
      "Página de manutenção",
    ],
  },
  {
    title: "Projetos Wikimedia",
    links: ["Wikimedia Commons", "Wikcionário", "Wikilivros", "Wikidata"],
  },
];

const legalLinks = ["Privacidade", "Termos de uso", "Contato"];

export function SiteFooter() {
  return (
    <footer className="flex w-full flex-col border-t border-border bg-background">
      <div className="flex w-full justify-between gap-16 p-12">
        <div className="flex w-70 flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <BookOpen className="size-[18px] text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-[-0.3px] text-foreground">
                Wikipédia
              </span>
              <span className="text-xs text-muted-foreground">
                A enciclopédia livre
              </span>
            </div>
          </div>
          <p className="text-[13px] leading-[1.5] text-muted-foreground">
            Um projeto colaborativo para criar uma enciclopédia livre e
            multilíngue, mantida por milhares de voluntários ao redor do mundo.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="flex w-40 flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-foreground">
              {column.title}
            </span>
            {column.links.map((link) => (
              <span key={link} className="text-[13px] text-muted-foreground">
                {link}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-border" />
      <div className="flex w-full items-center justify-between px-12 py-5">
        <span className="text-[13px] text-muted-foreground">
          © 2026 Wikipédia.
        </span>
        <div className="flex gap-5">
          {legalLinks.map((link) => (
            <span key={link} className="text-[13px] text-muted-foreground">
              {link}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
