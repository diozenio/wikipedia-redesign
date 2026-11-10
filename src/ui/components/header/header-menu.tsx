"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteNavItems } from "@/ui/components/site-navigation/site-nav-items";
import { cn, focusRing } from "@/ui/lib/utils";
import { Button } from "@/ui/primitives/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/ui/primitives/sheet";

const linkClassName = cn(
  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm text-foreground hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:font-medium",
  focusRing,
);

export function HeaderMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Abrir menu">
            <Menu />
          </Button>
        }
      />
      <SheetContent side="left" className="gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <SheetTitle className="text-base font-semibold text-foreground">
            Menu
          </SheetTitle>
          <SheetClose
            render={
              <Button variant="ghost" size="icon" aria-label="Fechar menu">
                <X />
              </Button>
            }
          />
        </div>
        <nav aria-label="Navegação do site">
          <ul className="flex flex-col gap-1">
            {siteNavItems.map((item) => {
              const internal = item.href.startsWith("/");
              const current = internal && pathname === item.href;
              const content = (
                <>
                  <item.icon className="size-4 text-muted-foreground" />
                  {item.label}
                </>
              );

              return (
                <li key={item.label}>
                  {internal ? (
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={linkClassName}
                    >
                      {content}
                    </Link>
                  ) : (
                    <a href={item.href} className={linkClassName}>
                      {content}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
