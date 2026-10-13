import { Skeleton } from "@/ui/primitives/skeleton";

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="size-8 rounded-md" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
