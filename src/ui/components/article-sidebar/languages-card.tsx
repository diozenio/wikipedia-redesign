import { ArrowRight, Languages } from "lucide-react";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { cn, focusRing } from "@/ui/lib/utils";

const languages = [
  {
    label: "English",
    lang: "en",
    href: "https://en.wikipedia.org/wiki/Information_system",
  },
  {
    label: "Español",
    lang: "es",
    href: "https://es.wikipedia.org/wiki/Sistema_de_información",
  },
  {
    label: "Français",
    lang: "fr",
    href: "https://fr.wikipedia.org/wiki/Système_d'information",
  },
  {
    label: "Deutsch",
    lang: "de",
    href: "https://de.wikipedia.org/wiki/Informationssystem",
  },
  {
    label: "日本語",
    lang: "ja",
    href: "https://ja.wikipedia.org/wiki/情報システム",
  },
];

export function LanguagesCard() {
  return (
    <SidebarCard icon={Languages} title="65 idiomas">
      <ul className="flex flex-wrap items-center gap-2 px-5 pb-4">
        {languages.map((language) => (
          <li key={language.lang}>
            <a
              href={language.href}
              lang={language.lang}
              hrefLang={language.lang}
              className={cn(
                "block rounded-md border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-muted",
                focusRing,
              )}
            >
              {language.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="https://www.wikidata.org/wiki/Special:ItemByTitle/ptwiki/Sistema_de_informação"
            className={cn(
              "flex items-center gap-1 rounded-md px-1 text-[13px] font-medium text-foreground hover:underline",
              focusRing,
            )}
          >
            Ver todos<span className="sr-only"> os idiomas</span>
            <ArrowRight className="size-3.5" />
          </a>
        </li>
      </ul>
    </SidebarCard>
  );
}
