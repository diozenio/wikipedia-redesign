import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticlePageLayout } from "@/ui/layouts/article-page-layout";
import { AppProvider } from "@/ui/providers/app-provider";

const meta = {
  title: "Layouts/ArticlePageLayout",
  component: ArticlePageLayout,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof ArticlePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
