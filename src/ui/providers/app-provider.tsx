import type { ReactNode } from "react";
import { LocaleProvider } from "@/ui/providers/locale-provider";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";
import { ThemeProvider } from "@/ui/providers/theme-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <MockArticleProvider>{children}</MockArticleProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
