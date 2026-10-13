import type { ReactNode } from "react";
import { Skeleton } from "@/ui/primitives/skeleton";

export function ArticleSection({
  titleWidth = "w-48",
  children,
}: {
  titleWidth?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-4 pt-4">
      <div className="flex w-full items-end justify-between border-b border-border pb-2">
        <Skeleton className={`h-7 ${titleWidth}`} />
        <div className="flex items-center gap-1">
          <Skeleton className="size-3" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
      {children}
    </section>
  );
}
