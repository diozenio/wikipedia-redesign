import type { ReactNode } from "react";
import { Toaster } from "@/ui/primitives/sonner";
import { AppearanceProvider } from "@/ui/providers/appearance-provider";
import { LocaleProvider } from "@/ui/providers/locale-provider";
import { MotionProvider } from "@/ui/providers/motion-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppearanceProvider>
      <MotionProvider>
        <LocaleProvider>
          {children}
          <Toaster />
        </LocaleProvider>
      </MotionProvider>
    </AppearanceProvider>
  );
}
