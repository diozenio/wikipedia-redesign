import { BookOpen } from "lucide-react";
import { cn, focusRing } from "@/ui/lib/utils";

const columns = [
  {
    title: "Sobre",
    links: [
      {
        label: "Sobre a Wikipédia",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Sobre",
      },
      {
        label: "Portal comunitário",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Portal_comunitário",
      },
      {
        label: "Página de boas-vindas",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Boas-vindas",
      },
      {
        label: "Contato",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Contato",
      },
    ],
  },
  {
    title: "Comunidade",
    links: [
      {
        label: "Alterações recentes",
        href: "https://pt.wikipedia.org/wiki/Especial:Mudanças_recentes",
      },
      {
        label: "Página de testes",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Página_de_testes",
      },
      {
        label: "Café dos novatos",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Café_dos_novatos",
      },
      {
        label: "Página de manutenção",
        href: "https://pt.wikipedia.org/wiki/Wikipédia:Manutenção",
      },
    ],
  },
  {
    title: "Projetos Wikimedia",
    links: [
      { label: "Wikimedia Commons", href: "https://commons.wikimedia.org/" },
      { label: "Wikcionário", href: "https://pt.wiktionary.org/" },
      { label: "Wikilivros", href: "https://pt.wikibooks.org/" },
      { label: "Wikidata", href: "https://www.wikidata.org/" },
    ],
  },
];

const legalLinks = [
  {
    label: "Privacidade",
    href: "https://foundation.wikimedia.org/wiki/Policy:Privacy_policy",
  },
  {
    label: "Termos de uso",
    href: "https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use",
  },
  {
    label: "Contato",
    href: "https://pt.wikipedia.org/wiki/Wikipédia:Contato",
  },
];

const footerLinkClassName = cn(
  "rounded-sm text-[0.8125rem] text-muted-foreground hover:text-foreground hover:underline",
  focusRing,
);

export function SiteFooter() {
  return (
    <footer className="@container flex w-full flex-col border-t border-border bg-background">
      <div className="grid w-full grid-cols-1 gap-8 px-4 py-8 @min-[40rem]:grid-cols-3 @min-[40rem]:px-6 @min-[40rem]:py-10 @min-[64rem]:grid-cols-[17.5rem_repeat(3,10rem)] @min-[64rem]:justify-between @min-[64rem]:gap-16 @min-[64rem]:p-12">
        <div className="flex flex-col gap-3 @min-[40rem]:col-span-3 @min-[64rem]:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <BookOpen className="size-4.5 text-primary-foreground" />
            </div>
            <p className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-[-0.02em] text-foreground">
                Wikipédia
              </span>
              <span className="text-xs text-muted-foreground">
                A enciclopédia livre
              </span>
            </p>
          </div>
          <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
            Um projeto colaborativo para criar uma enciclopédia livre e
            multilíngue, mantida por milhares de voluntários ao redor do mundo.
          </p>
        </div>
        {columns.map((column) => {
          const headingId = `rodape-${column.title.toLowerCase().replaceAll(" ", "-")}`;

          return (
            <nav
              key={column.title}
              aria-labelledby={headingId}
              className="flex flex-col gap-2.5"
            >
              <h2
                id={headingId}
                className="text-[0.8125rem] font-semibold text-foreground"
              >
                {column.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label} className="flex">
                    <a href={link.href} className={footerLinkClassName}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>
      <div className="h-px w-full bg-border" />
      <div className="flex w-full flex-col gap-3 px-4 py-5 @min-[40rem]:flex-row @min-[40rem]:items-center @min-[40rem]:justify-between @min-[40rem]:px-6 @min-[64rem]:px-12">
        <p className="text-[0.8125rem] text-muted-foreground">
          <small className="text-[0.8125rem]">© 2026 Wikipédia.</small>
        </p>
        <nav aria-label="Informações legais">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label} className="flex">
                <a href={link.href} className={footerLinkClassName}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
