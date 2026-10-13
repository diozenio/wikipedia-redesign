import { HeaderActions } from "@/ui/components/header/header-actions";
import { HeaderBrand } from "@/ui/components/header/header-brand";
import { HeaderSearch } from "@/ui/components/header/header-search";

export function SiteHeader() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border px-8">
      <HeaderBrand />
      <HeaderSearch />
      <HeaderActions />
    </header>
  );
}
