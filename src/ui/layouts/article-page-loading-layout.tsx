import { SiteHeader } from "@/ui/components/header/site-header";
import { SkipLink } from "@/ui/components/skip-link";
import { Skeleton } from "@/ui/primitives/skeleton";

const MAIN_CONTENT_ID = "conteudo";

export function ArticlePageLoadingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <SiteHeader />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        aria-busy="true"
        className="mx-auto flex w-full max-w-[52rem] flex-col gap-4 px-4 pt-8 pb-10 outline-none sm:px-6"
      >
        <output className="sr-only">Carregando artigo…</output>
        <div aria-hidden="true" className="flex flex-col gap-4">
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-11 w-3/4" />
          <Skeleton className="h-4 w-64 max-w-full" />
          <div className="flex flex-col gap-2.5 pt-6">
            {["a", "b", "c", "d", "e", "f"].map((key) => (
              <Skeleton key={key} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </main>
    </div>
  );
}
