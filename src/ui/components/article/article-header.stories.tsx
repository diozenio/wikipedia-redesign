import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleHeader } from "@/ui/components/article/article-header";

const meta = {
  title: "Components/Article/ArticleHeader",
  component: ArticleHeader,
  parameters: { center: false },
} satisfies Meta<typeof ArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
