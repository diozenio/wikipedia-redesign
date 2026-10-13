import { Skeleton } from "@/ui/primitives/skeleton";

const rows = [1, 2, 3, 4];

export function SummaryCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="flex flex-col px-5 pb-4">
        {rows.map((row) => (
          <div
            key={row}
            className="flex flex-col gap-1.5 border-t border-border py-2.5"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
