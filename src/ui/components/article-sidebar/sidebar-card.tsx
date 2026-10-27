import type { LucideIcon } from "lucide-react";
import { type ReactNode, useId } from "react";

export function SidebarCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs"
    >
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Icon className="size-4 text-muted-foreground" />
        <h2 id={headingId} className="text-sm font-semibold text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
