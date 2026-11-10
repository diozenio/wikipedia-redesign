import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/ui/lib/utils";
import { Button } from "@/ui/primitives/button";

type PlayerButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
  icon: ReactNode;
  label: string;
  srLabel?: string;
  primary?: boolean;
};

export function PlayerButton({
  icon,
  label,
  srLabel,
  primary = false,
  className,
  ...props
}: PlayerButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto min-w-11 flex-col gap-0.5 px-1.5 py-1 text-[0.6875rem] leading-none font-medium",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full",
          primary && "bg-primary text-primary-foreground",
        )}
      >
        {icon}
      </span>
      <span>
        {label}
        {srLabel && <span className="sr-only"> {srLabel}</span>}
      </span>
    </Button>
  );
}
