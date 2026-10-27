import { cn, focusRing } from "@/ui/lib/utils";

export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50",
        focusRing,
      )}
    >
      Pular para o conteúdo
    </a>
  );
}
