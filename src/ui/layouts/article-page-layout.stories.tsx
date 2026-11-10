import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticlePageLayout } from "@/ui/layouts/article-page-layout";

const meta = {
  title: "Layouts/ArticlePageLayout",
  component: ArticlePageLayout,
  parameters: { center: false },
} satisfies Meta<typeof ArticlePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
