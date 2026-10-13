import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";

const meta = {
  title: "Components/ArticleSidebar/ArticleSidebar",
  component: ArticleSidebar,
  parameters: { center: false },
} satisfies Meta<typeof ArticleSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
