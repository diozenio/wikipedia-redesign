import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryCard } from "@/ui/components/article-sidebar/summary-card";

const meta = {
  title: "Components/ArticleSidebar/SummaryCard",
  component: SummaryCard,
  parameters: { center: false },
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
