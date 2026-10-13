import { Skeleton } from "@/ui/primitives/skeleton";

const categories = [1, 2, 3];
const links = [1, 2, 3, 4];

export function SiteFooter() {
  return (
    <footer className="flex w-full flex-col gap-5 border-t border-border bg-muted p-8">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-20" />
        {categories.map((category) => (
          <Skeleton key={category} className="h-5 w-32 rounded-full" />
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-3.5 w-[720px] max-w-full" />
        <div className="flex gap-5">
          {links.map((link) => (
            <Skeleton key={link} className="h-3.5 w-20" />
          ))}
        </div>
      </div>
    </footer>
  );
}
