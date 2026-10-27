import { BookOpen, Menu } from "lucide-react";
import Link from "next/link";
import { cn, focusRing } from "@/ui/lib/utils";
import { Button } from "@/ui/primitives/button";

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" aria-label="Abrir menu">
        <Menu />
      </Button>
      <Link
        href="/"
        aria-label="Wikipédia, a enciclopédia livre — Página principal"
        className={cn("flex items-center gap-3 rounded-md", focusRing)}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <BookOpen className="size-[18px] text-primary-foreground" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-[-0.3px] text-foreground">
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
