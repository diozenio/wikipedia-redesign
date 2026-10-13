import { Separator } from "@/ui/primitives/separator";
import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticleToolbar() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-0.5 rounded-md bg-muted p-0.75">
        <div className="rounded-[calc(var(--radius-md)-2px)] bg-background px-3.5 py-1.5 shadow-xs">
          <Skeleton className="h-3.5 w-12" />
        </div>
        <div className="px-3.5 py-1.5">
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-3.5 w-8" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md px-3 py-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-3.5 w-12" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md px-3 py-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="size-7 rounded-md" />
      </div>
    </div>
  );
}
