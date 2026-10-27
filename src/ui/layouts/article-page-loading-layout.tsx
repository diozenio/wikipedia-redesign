import { SiteHeader } from "@/ui/components/header/site-header";
import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticlePageLoadingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main
        aria-busy="true"
        className="mx-auto flex w-full max-w-[52rem] flex-col gap-4 px-4 pt-8 pb-10 sm:px-6"
      >
        <span className="sr-only">Carregando artigo</span>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-11 w-3/4" />
        <Skeleton className="h-4 w-64" />
        <div className="flex flex-col gap-2.5 pt-6">
          {["a", "b", "c", "d", "e", "f"].map((key) => (
            <Skeleton key={key} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-2/3" />
        </div>
      </main>
    </div>
  );
}
