"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { EmptyStateContext } from "@/ui/contexts/empty-state-context";

export function NotFoundProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const value = useMemo(
    () => ({
      media: "404",
      title: "Page not found",
      description: "The page you are looking for doesn't exist or was moved.",
      action: {
        label: "Go home",
        onClick: () => router.push("/"),
      },
    }),
    [router],
  );

  return <EmptyStateContext value={value}>{children}</EmptyStateContext>;
}
