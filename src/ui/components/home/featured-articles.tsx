"use client";

import { Sparkles } from "lucide-react";
import { FeaturedArticleCard } from "@/ui/components/home/featured-article-card";
import { useFeaturedArticles } from "@/ui/contexts/featured-articles-context";
import { formatFeaturedDate } from "@/ui/lib/featured-date";
import { Skeleton } from "@/ui/primitives/skeleton";

export function FeaturedArticles() {
  const { date, status, articles } = useFeaturedArticles();
  const [lead, ...rest] = articles;

  return (
    <section
      aria-labelledby="featured-articles-title"
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4.5 text-muted-foreground" />
          <h2
            id="featured-articles-title"
            className="text-xl font-semibold tracking-[-0.02em] text-foreground"
          >
            Artigos em destaque
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Os mais lidos em{" "}
          <time dateTime={date}>{formatFeaturedDate(date)}</time>
        </p>
      </div>
      {status === "loading" ? (
        <FeaturedArticlesSkeleton />
      ) : status === "error" ? (
        <FeaturedArticlesMessage>
          Não foi possível carregar os destaques. Tente novamente mais tarde.
        </FeaturedArticlesMessage>
      ) : lead ? (
        <>
          <FeaturedArticleCard article={lead} variant="lead" />
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-4 @min-[40rem]/page:grid-cols-2 @min-[40rem]/page:gap-5 @min-[64rem]/page:grid-cols-3">
              {rest.map((article) => (
                <FeaturedArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </>
      ) : (
        <FeaturedArticlesMessage>
          Nenhum destaque disponível para esta data.
        </FeaturedArticlesMessage>
      )}
    </section>
  );
}

function FeaturedArticlesMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function FeaturedArticlesSkeleton() {
  return (
    <div
      aria-busy="true"
      className="flex flex-col gap-4 @min-[40rem]/page:gap-5"
    >
      <span className="sr-only">Carregando destaques</span>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 @min-[40rem]/page:grid-cols-2 @min-[40rem]/page:gap-5 @min-[64rem]/page:grid-cols-3">
        {["a", "b", "c"].map((key) => (
          <Skeleton key={key} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
