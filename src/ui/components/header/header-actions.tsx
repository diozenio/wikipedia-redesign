import { LogIn, Search } from "lucide-react";
import { HeaderAppearanceMenu } from "@/ui/components/header/header-appearance-menu";
import { HeaderLanguageSwitcher } from "@/ui/components/header/header-language-switcher";
import { Button } from "@/ui/primitives/button";

export function HeaderActions({
  searchOpen = false,
  onToggleSearch,
}: {
  searchOpen?: boolean;
  onToggleSearch?: () => void;
}) {
  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-1 @min-[48rem]:ml-0 @min-[48rem]:gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Pesquisar"
        aria-expanded={searchOpen}
        aria-controls="header-search-mobile"
        className="@min-[48rem]:hidden"
        onClick={onToggleSearch}
      >
        <Search />
      </Button>
      <HeaderLanguageSwitcher />
      <HeaderAppearanceMenu />
      <Button
        variant="ghost"
        className="hidden h-auto gap-2 px-3.5 py-2 @min-[64rem]:inline-flex"
      >
        <span className="text-sm font-medium">Criar conta</span>
      </Button>
      <Button className="h-auto gap-2 px-2.5 py-2 @min-[40rem]:px-3.5">
        <LogIn className="size-4" />
        <span className="sr-only text-sm font-medium @min-[40rem]:not-sr-only">
          Entrar
        </span>
      </Button>
    </div>
  );
}
