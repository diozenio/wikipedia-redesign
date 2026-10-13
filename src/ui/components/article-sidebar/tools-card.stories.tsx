import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToolsCard } from "@/ui/components/article-sidebar/tools-card";

const meta = {
  title: "Components/ArticleSidebar/ToolsCard",
  component: ToolsCard,
  parameters: { center: false },
} satisfies Meta<typeof ToolsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
