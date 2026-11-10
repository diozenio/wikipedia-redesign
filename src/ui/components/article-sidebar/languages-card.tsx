"use client";

import { Languages } from "lucide-react";
import type { ArticleLanguage } from "@/ui/components/article/types";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { useArticle } from "@/ui/contexts/article-context";
import { cn, focusRing } from "@/ui/lib/utils";

const FEATURED_COUNT = 8;

function LanguageLink({
  language,
  className,
}: {
  language: ArticleLanguage;
  className: string;
}) {
  return (
    <a
      href={language.url}
      lang={language.code}
      hrefLang={language.code}
      title={language.name}
      className={cn(className, focusRing)}
    >
      {language.autonym}
    </a>
  );
}

export function LanguagesCard() {
  const { languages } = useArticle();
  const count = languages.length;

  return (
    <SidebarCard
      icon={Languages}
      title={count === 1 ? "1 idioma" : `${count} idiomas`}
    >
      {count === 0 ? (
        <p className="px-5 pb-4 text-sm text-muted-foreground">
          Este artigo não está disponível em outros idiomas.
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-5 pb-4">
          <ul className="flex flex-wrap items-center gap-2">
            {languages.slice(0, FEATURED_COUNT).map((language) => (
              <li key={language.url}>
                <LanguageLink
                  language={language}
                  className="block rounded-md border border-border bg-card px-3 py-1.5 text-[0.8125rem] font-medium text-foreground hover:bg-muted"
                />
              </li>
            ))}
          </ul>
          {count > FEATURED_COUNT && (
            <details>
              <summary
                className={cn(
                  "w-fit cursor-pointer rounded-md px-1 text-[0.8125rem] font-medium text-foreground hover:underline",
                  focusRing,
                )}
              >
                Ver todos os {count} idiomas
              </summary>
              <ul className="mt-2 grid max-h-72 grid-cols-2 gap-x-3 gap-y-1 overflow-y-auto">
                {languages.map((language) => (
                  <li key={language.url}>
                    <LanguageLink
                      language={language}
                      className="block truncate rounded-sm py-1 text-[0.8125rem] text-foreground hover:underline"
                    />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </SidebarCard>
  );
}
