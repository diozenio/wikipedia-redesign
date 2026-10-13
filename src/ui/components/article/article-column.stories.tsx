import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleColumn } from "@/ui/components/article/article-column";

const meta = {
  title: "Components/Article/ArticleColumn",
  component: ArticleColumn,
  parameters: { center: false },
} satisfies Meta<typeof ArticleColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
