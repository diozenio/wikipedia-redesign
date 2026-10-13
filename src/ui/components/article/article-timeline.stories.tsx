import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleTimeline } from "@/ui/components/article/article-timeline";

const meta = {
  title: "Components/Article/ArticleTimeline",
  component: ArticleTimeline,
  parameters: { center: false },
} satisfies Meta<typeof ArticleTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
