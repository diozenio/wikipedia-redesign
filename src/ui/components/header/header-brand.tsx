import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/ui/primitives/button";

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" aria-label="Abrir menu">
        <Menu />
      </Button>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
        <BookOpen className="size-[18px] text-primary-foreground" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-[-0.3px] text-foreground">
          Wikipédia
        </span>
        <span className="text-xs text-muted-foreground">
          A enciclopédia livre
        </span>
      </div>
    </div>
  );
}
