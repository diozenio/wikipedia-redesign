import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticleBreadcrumb() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-3.5 w-16" />
      <Skeleton className="size-3.5" />
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="size-3.5" />
      <Skeleton className="h-3.5 w-40" />
    </div>
  );
}
