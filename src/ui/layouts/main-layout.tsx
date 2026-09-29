import { AppHeader } from "@/ui/components/app-header";
import { ProfileCard } from "@/ui/components/profile-card";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex flex-1 items-center justify-center p-6">
        <ProfileCard />
      </main>
    </div>
  );
}
