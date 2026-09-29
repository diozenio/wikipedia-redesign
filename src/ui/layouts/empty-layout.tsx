import { EmptyState } from "@/ui/components/empty-state";

export function EmptyLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <EmptyState />
    </main>
  );
}
