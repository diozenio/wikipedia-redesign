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
    <footer className="@container flex w-full flex-col border-t border-border bg-background">
      <div className="grid w-full grid-cols-1 gap-8 px-4 py-8 @min-[40rem]:grid-cols-3 @min-[40rem]:px-6 @min-[40rem]:py-10 @min-[64rem]:grid-cols-[17.5rem_repeat(3,10rem)] @min-[64rem]:justify-between @min-[64rem]:gap-16 @min-[64rem]:p-12">
        <div className="flex flex-col gap-3 @min-[40rem]:col-span-3 @min-[64rem]:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <BookOpen className="size-4.5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-[-0.02em] text-foreground">
                Wikipédia
              </span>
              <span className="text-xs text-muted-foreground">
                A enciclopédia livre
              </span>
            </div>
          </div>
          <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
            Um projeto colaborativo para criar uma enciclopédia livre e
            multilíngue, mantida por milhares de voluntários ao redor do mundo.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-2.5">
            <span className="text-[0.8125rem] font-semibold text-foreground">
              {column.title}
            </span>
            {column.links.map((link) => (
              <span
                key={link}
                className="text-[0.8125rem] text-muted-foreground"
              >
                {link}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-border" />
      <div className="flex w-full flex-col gap-3 px-4 py-5 @min-[40rem]:flex-row @min-[40rem]:items-center @min-[40rem]:justify-between @min-[40rem]:px-6 @min-[64rem]:px-12">
        <span className="text-[0.8125rem] text-muted-foreground">
          © 2026 Wikipédia.
        </span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <span key={link} className="text-[0.8125rem] text-muted-foreground">
              {link}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
