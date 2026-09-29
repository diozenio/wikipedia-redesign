import { MainLayout } from "@/ui/layouts/main-layout";
import { AppProvider } from "@/ui/providers/app-provider";

export default function Home() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
