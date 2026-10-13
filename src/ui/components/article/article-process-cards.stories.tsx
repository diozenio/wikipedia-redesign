import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleProcessCards } from "@/ui/components/article/article-process-cards";

const meta = {
  title: "Components/Article/ArticleProcessCards",
  component: ArticleProcessCards,
  parameters: { center: false },
} satisfies Meta<typeof ArticleProcessCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
