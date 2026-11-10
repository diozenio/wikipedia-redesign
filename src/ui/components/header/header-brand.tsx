import { BookOpen } from "lucide-react";
import Link from "next/link";
import { HeaderMenu } from "@/ui/components/header/header-menu";
import { cn, focusRing } from "@/ui/lib/utils";

export function HeaderBrand() {
  return (
    <div className="flex shrink-0 items-center gap-2 @min-[48rem]:gap-3">
      <HeaderMenu />
      <Link
        href="/"
        aria-label="Wikipédia, a enciclopédia livre — Página principal"
        className={cn(
          "flex items-center gap-2 rounded-md @min-[48rem]:gap-3",
          focusRing,
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <BookOpen className="size-4.5 text-primary-foreground" />
        </span>
        <span className="hidden flex-col leading-tight @min-[40rem]:flex">
          <span className="text-base font-semibold tracking-[-0.02em] text-foreground">
            Wikipédia
          </span>
          <span className="text-xs text-muted-foreground">
            A enciclopédia livre
          </span>
        </span>
      </Link>
    </div>
  );
}
