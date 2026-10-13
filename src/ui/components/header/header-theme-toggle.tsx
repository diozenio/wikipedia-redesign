"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/ui/contexts/theme-context";
import { Button } from "@/ui/primitives/button";

export function HeaderThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
