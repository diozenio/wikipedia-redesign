import type { ReactNode } from "react";
import { AppearanceProvider } from "@/ui/providers/appearance-provider";
import { LocaleProvider } from "@/ui/providers/locale-provider";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppearanceProvider>
      <LocaleProvider>
        <MockArticleProvider>{children}</MockArticleProvider>
      </LocaleProvider>
    </AppearanceProvider>
  );
}
