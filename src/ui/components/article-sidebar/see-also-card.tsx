import { Skeleton } from "@/ui/primitives/skeleton";

const items = [1, 2, 3, 4];

export function SeeAlsoCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="flex flex-col gap-1 px-5 pb-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 py-1.5">
            <Skeleton className="size-3.5" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
