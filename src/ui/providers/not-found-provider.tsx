"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { EmptyStateContext } from "@/ui/contexts/empty-state-context";

export function NotFoundProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const value = useMemo(
    () => ({
      media: "404",
      title: "Página não encontrada",
      description: "A página que você procura não existe ou foi movida.",
      action: {
        label: "Ir para a página inicial",
        onClick: () => router.push("/"),
      },
    }),
    [router],
  );

  return <EmptyStateContext value={value}>{children}</EmptyStateContext>;
}
