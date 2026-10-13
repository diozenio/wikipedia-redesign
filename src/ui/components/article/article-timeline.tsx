import { cn } from "@/ui/lib/utils";
import { Skeleton } from "@/ui/primitives/skeleton";

const eras = [
  { id: "before-1940", width: "w-28" },
  { id: "1940-1952", width: "w-24" },
  { id: "1952-1964", width: "w-24" },
  { id: "1964-1971", width: "w-24" },
  { id: "1971-1981", width: "w-24" },
  { id: "1981-now", width: "w-28" },
] as const;

export function ArticleTimeline() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border">
      {eras.map((era, index) => (
        <div
          key={era.id}
          className={cn(
            "flex items-center gap-5 px-5 py-3.5",
            index > 0 && "border-t border-border",
          )}
        >
          <div className="flex w-[120px] shrink-0 items-center gap-2">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                index === eras.length - 1 ? "bg-primary" : "bg-ring",
              )}
            />
            <Skeleton className={cn("h-3.5", era.width)} />
          </div>
          <Skeleton className="h-3.5 flex-1" />
        </div>
      ))}
    </div>
  );
}
