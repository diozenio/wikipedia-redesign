import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleDataTable } from "@/ui/components/article/article-data-table";

const meta = {
  title: "Components/Article/ArticleDataTable",
  component: ArticleDataTable,
  parameters: { center: false },
} satisfies Meta<typeof ArticleDataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
