import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleReadButtonView } from "@/ui/components/article/article-read-button";

const meta = {
  title: "Components/Article/ArticleReadButton",
  component: ArticleReadButtonView,
  args: { phase: "idle", progress: 0 },
} satisfies Meta<typeof ArticleReadButtonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Requesting: Story = { args: { phase: "requesting" } };

export const Generating: Story = {
  args: { phase: "generating", progress: 42 },
};

export const Failed: Story = { args: { phase: "error" } };
