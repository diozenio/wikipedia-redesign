import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleBreadcrumb } from "@/ui/components/article/article-breadcrumb";

const meta = {
  title: "Components/Article/ArticleBreadcrumb",
  component: ArticleBreadcrumb,
  parameters: { center: false },
} satisfies Meta<typeof ArticleBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
