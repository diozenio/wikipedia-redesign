import { Skeleton } from "@/ui/primitives/skeleton";

const rows = [1, 2, 3, 4];

export function ArticleDataTable() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-4 bg-muted px-4 py-3">
        <Skeleton className="h-3.5 flex-1" />
        <Skeleton className="h-3.5 w-[110px]" />
        <Skeleton className="h-3.5 w-[140px]" />
      </div>
      {rows.map((row) => (
        <div
          key={row}
          className="flex items-center gap-4 border-t border-border px-4 py-3"
        >
          <Skeleton className="h-3.5 flex-1" />
          <Skeleton className="h-3.5 w-[110px]" />
          <Skeleton className="h-5 w-[90px] rounded-full" />
        </div>
      ))}
    </div>
  );
}
