import { EmptyLayout } from "@/ui/layouts/empty-layout";
import { NotFoundProvider } from "@/ui/providers/not-found-provider";

export default function NotFound() {
  return (
    <NotFoundProvider>
      <EmptyLayout />
    </NotFoundProvider>
  );
}
