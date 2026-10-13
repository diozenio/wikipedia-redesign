import type { ReactNode } from "react";
import { LocaleProvider } from "@/ui/providers/locale-provider";
import { ThemeProvider } from "@/ui/providers/theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
