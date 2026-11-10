import { EmptyState } from "@/ui/components/empty-state";
import { SkipLink } from "@/ui/components/skip-link";

const MAIN_CONTENT_ID = "conteudo";

export function EmptyLayout() {
  return (
    <>
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex min-h-screen items-center justify-center p-6 outline-none"
      >
        <EmptyState />
      </main>
    </>
  );
}
