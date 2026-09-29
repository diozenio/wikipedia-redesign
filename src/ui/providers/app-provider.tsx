import type { ReactNode } from "react";
import { ProfileProvider } from "@/ui/providers/profile-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
