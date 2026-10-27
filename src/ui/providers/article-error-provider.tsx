"use client";

import { type ReactNode, useMemo } from "react";
import { EmptyStateContext } from "@/ui/contexts/empty-state-context";

export function ArticleErrorProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      title: "Não foi possível carregar o artigo",
      description:
        "A Wikipédia não respondeu como esperado. Verifique sua conexão e tente novamente.",
      action: {
        label: "Tentar novamente",
        onClick: () => window.location.reload(),
      },
    }),
    [],
  );

  return <EmptyStateContext value={value}>{children}</EmptyStateContext>;
}
