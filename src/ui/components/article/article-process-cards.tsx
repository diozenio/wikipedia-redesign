import { Skeleton } from "@/ui/primitives/skeleton";

const cards = [1, 2, 3];

export function ArticleProcessCards() {
  return (
    <div className="flex w-full gap-4">
      {cards.map((card) => (
        <div
          key={card}
          className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs"
        >
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      ))}
    </div>
  );
}
