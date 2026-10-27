import { ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FeaturedArticleData } from "@/ui/components/home/types";
import { cn } from "@/ui/lib/utils";

const viewsFormatter = new Intl.NumberFormat("pt-BR");

type FeaturedArticleCardProps = {
  article: FeaturedArticleData;
  variant?: "default" | "lead";
};

export function FeaturedArticleCard({
  article,
  variant = "default",
}: FeaturedArticleCardProps) {
  const isLead = variant === "lead";

  return (
    <Link
      href={`/articles/${encodeURIComponent(article.slug)}`}
      className={cn(
        "group flex w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-colors outline-none hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50",
        isLead
          ? "flex-col @min-[48rem]/page:flex-row-reverse"
          : "flex-col gap-3 p-5 @min-[48rem]/page:p-6",
      )}
    >
      {isLead && article.thumbnail && (
        <div className="relative aspect-video w-full shrink-0 bg-muted @min-[48rem]/page:aspect-auto @min-[48rem]/page:w-72">
          <Image
            src={article.thumbnail.src}
            alt=""
            fill
            sizes="(min-width: 48rem) 18rem, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          isLead ? "gap-3 p-5 @min-[48rem]/page:p-8" : "gap-3",
        )}
      >
        <div className="flex flex-col gap-1.5">
          <h3
            className={cn(
              "font-semibold text-card-foreground",
              isLead
                ? "text-[1.625rem] leading-tight tracking-[-0.023em] @min-[48rem]/page:text-[2rem] @min-[48rem]/page:tracking-[-0.025em]"
                : "text-xl leading-snug tracking-[-0.02em]",
            )}
          >
            {article.title}
          </h3>
          {article.description && (
            <p className="text-[0.8125rem] text-muted-foreground">
              {article.description}
            </p>
          )}
        </div>
        <p
          className={cn(
            "text-muted-foreground",
            isLead
              ? "text-[0.9375rem] leading-[1.6] @min-[48rem]/page:text-base"
              : "line-clamp-3 text-sm leading-[1.55]",
          )}
        >
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-1">
          {article.views !== null ? (
            <span className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
              <Eye className="size-3.5" />
              {viewsFormatter.format(article.views)} visualizações
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-foreground">
            Ler artigo
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
