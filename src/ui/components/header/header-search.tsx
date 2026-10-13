import { Skeleton } from "@/ui/primitives/skeleton";

export function HeaderSearch() {
  return (
    <div className="flex h-10 w-[480px] items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-10 rounded bg-muted" />
    </div>
  );
}
