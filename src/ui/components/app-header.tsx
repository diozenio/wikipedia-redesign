"use client";

import { useHeader } from "@/ui/contexts/header-context";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";

export function AppHeader() {
  const { title, tag } = useHeader();

  return (
    <header className="flex flex-col">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="font-semibold">{title}</span>
        {tag && <Badge variant={tag.variant}>{tag.label}</Badge>}
      </div>
      <Separator />
    </header>
  );
}
