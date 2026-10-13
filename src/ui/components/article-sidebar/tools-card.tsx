import { Skeleton } from "@/ui/primitives/skeleton";

const tools = [1, 2, 3, 4, 5];

export function ToolsCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="flex flex-col gap-1 px-5 pb-4">
        {tools.map((tool) => (
          <div key={tool} className="flex items-center gap-2.5 rounded-md p-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
