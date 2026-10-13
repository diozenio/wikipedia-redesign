import { Skeleton } from "@/ui/primitives/skeleton";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-md border border-border px-3.5 py-2 shadow-xs">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="size-3.5" />
      </div>
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
      <div className="flex items-center gap-2 rounded-md bg-primary px-3.5 py-2">
        <Skeleton className="size-4 bg-primary-foreground/30" />
        <Skeleton className="h-4 w-12 bg-primary-foreground/30" />
      </div>
    </div>
  );
}
