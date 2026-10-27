"use client";

import { ALargeSmall } from "lucide-react";
import { AppearancePanel } from "@/ui/components/appearance/appearance-panel";
import { useMediaQuery } from "@/ui/lib/use-media-query";
import { Button } from "@/ui/primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/ui/primitives/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/ui/primitives/sheet";

const TITLE = "Aparência";
const DESCRIPTION = "Suas preferências ficam salvas neste navegador.";

const titleClassName = "text-base font-semibold text-foreground";
const descriptionClassName = "text-[0.8125rem] text-muted-foreground";

// Rendered through the trigger's `render` prop, which merges props onto it.
const triggerButton = (
  <Button variant="ghost" size="icon" aria-label={TITLE}>
    <ALargeSmall />
  </Button>
);

export function HeaderAppearanceMenu() {
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger render={triggerButton} />
        <PopoverContent
          align="end"
          className="w-[min(24.5rem,calc(100vw-2rem))] p-5"
        >
          <AppearancePanel
            header={
              <div className="flex flex-col gap-0.5">
                <PopoverTitle className={titleClassName}>{TITLE}</PopoverTitle>
                <PopoverDescription className={descriptionClassName}>
                  {DESCRIPTION}
                </PopoverDescription>
              </div>
            }
            footerHint="Esc para fechar"
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet>
      <SheetTrigger render={triggerButton} />
      <SheetContent className="px-5 pt-3 pb-7">
        <AppearancePanel
          header={
            <div className="flex flex-col gap-0.5">
              <SheetTitle className={titleClassName}>{TITLE}</SheetTitle>
              <SheetDescription className={descriptionClassName}>
                {DESCRIPTION}
              </SheetDescription>
            </div>
          }
        />
      </SheetContent>
    </Sheet>
  );
}
