import { BookOpen, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/primitives/button";

export function HeaderBrand() {
  return (
    <div className="flex shrink-0 items-center gap-2 @min-[48rem]:gap-3">
      <Button variant="ghost" size="icon" aria-label="Abrir menu">
        <Menu />
      </Button>
      <Link
        href="/"
        aria-label="Wikipédia, página inicial"
        className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @min-[48rem]:gap-3"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <BookOpen className="size-4.5 text-primary-foreground" />
        </div>
        <div className="hidden flex-col leading-tight @min-[40rem]:flex">
          <span className="text-base font-semibold tracking-[-0.02em] text-foreground">
            Wikipédia
          </span>
          <span className="text-xs text-muted-foreground">
            A enciclopédia livre
          </span>
        </div>
      </Link>
    </div>
  );
}
