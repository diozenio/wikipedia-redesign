"use client";

import { createContext, useContext } from "react";
import type { Action } from "@/ui/lib/action";

export type ProfileCardContextValue = {
  title: string;
  subtitle?: string;
  tag?: string;
  avatarFallback?: string;
  description?: string;
  action?: Action;
};

export const ProfileCardContext = createContext<ProfileCardContextValue | null>(
  null,
);

export function useProfileCard() {
  const context = useContext(ProfileCardContext);

  if (!context) {
    throw new Error(
      "useProfileCard must be used within a ProfileCardContext provider",
    );
  }

  return context;
}
