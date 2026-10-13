import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleIntro } from "@/ui/components/article/article-intro";

const meta = {
  title: "Components/Article/ArticleIntro",
  component: ArticleIntro,
  parameters: { center: false },
} satisfies Meta<typeof ArticleIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
