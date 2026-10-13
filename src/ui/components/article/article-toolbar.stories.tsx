import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleToolbar } from "@/ui/components/article/article-toolbar";

const meta = {
  title: "Components/Article/ArticleToolbar",
  component: ArticleToolbar,
  parameters: { center: false },
} satisfies Meta<typeof ArticleToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
