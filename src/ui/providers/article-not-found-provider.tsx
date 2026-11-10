"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { EmptyStateContext } from "@/ui/contexts/empty-state-context";

export function ArticleNotFoundProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const value = useMemo(
    () => ({
      media: "404",
      title: "Artigo não encontrado",
      description:
        "O artigo que você procura não existe na Wikipédia ou foi movido.",
      action: {
        label: "Ir para a página inicial",
        onClick: () => router.push("/"),
      },
    }),
    [router],
  );

  return <EmptyStateContext value={value}>{children}</EmptyStateContext>;
}
