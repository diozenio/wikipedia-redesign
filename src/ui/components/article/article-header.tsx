import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticleHeader() {
  return (
    <div className="flex w-full flex-col gap-3 pt-4">
      <Skeleton className="h-11 w-3/5" />
      <Skeleton className="h-3.5 w-64" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-40 rounded-full" />
        <Skeleton className="h-5 w-48 rounded-full" />
        <Skeleton className="h-5 w-44 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3.5 w-32" />
      </div>
    </div>
  );
}
