import { LogIn } from "lucide-react";
import { HeaderLanguageSwitcher } from "@/ui/components/header/header-language-switcher";
import { HeaderThemeToggle } from "@/ui/components/header/header-theme-toggle";
import { Button } from "@/ui/primitives/button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <HeaderLanguageSwitcher />
      <HeaderThemeToggle />
      <Button variant="ghost" className="h-auto gap-2 px-3.5 py-2">
        <span className="text-sm font-medium">Criar conta</span>
      </Button>
      <Button className="h-auto gap-2 px-3.5 py-2">
        <LogIn className="size-4" />
        <span className="text-sm font-medium">Entrar</span>
      </Button>
    </div>
  );
}
