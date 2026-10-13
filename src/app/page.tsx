import { ArticlePageLayout } from "@/ui/layouts/article-page-layout";
import { AppProvider } from "@/ui/providers/app-provider";

export default function Home() {
  return (
    <AppProvider>
      <ArticlePageLayout />
    </AppProvider>
  );
}
