"use client";

import { useState } from "react";
import { HeaderActions } from "@/ui/components/header/header-actions";
import { HeaderBrand } from "@/ui/components/header/header-brand";
import { HeaderSearch } from "@/ui/components/header/header-search";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="@container relative z-40 w-full shrink-0 border-b border-border bg-background">
      <div className="flex min-h-16 flex-wrap items-center gap-2 px-4 py-2 @min-[48rem]:flex-nowrap @min-[48rem]:gap-4 @min-[48rem]:px-6 @min-[80rem]:px-8">
        <HeaderBrand />
        <div className="hidden flex-1 justify-center @min-[48rem]:flex">
          <HeaderSearch />
        </div>
        <HeaderActions
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen((open) => !open)}
        />
      </div>
      {searchOpen && (
        <div
          id="header-search-mobile"
          className="px-4 pb-3 @min-[48rem]:hidden"
        >
          <HeaderSearch autoFocus />
        </div>
      )}
    </header>
  );
}
