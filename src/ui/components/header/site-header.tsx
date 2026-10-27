import { HeaderActions } from "@/ui/components/header/header-actions";
import { HeaderBrand } from "@/ui/components/header/header-brand";
import { HeaderSearch } from "@/ui/components/header/header-search";

export function SiteHeader() {
  return (
    <header className="relative z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <HeaderBrand />
      <search className="absolute left-1/2 -translate-x-1/2">
        <HeaderSearch />
      </search>
      <HeaderActions />
    </header>
  );
}
