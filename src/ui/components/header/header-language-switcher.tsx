"use client";

import { ChevronDown, Languages } from "lucide-react";
import {
  LOCALE_OPTIONS,
  type Locale,
  useLocale,
} from "@/ui/contexts/locale-context";
import { Button } from "@/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";

export function HeaderLanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const current = LOCALE_OPTIONS.find((option) => option.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-auto gap-2 px-3.5 py-2">
            <Languages className="size-4" />
            <span className="text-sm font-medium">{current?.label}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          {LOCALE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.code} value={option.code}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
