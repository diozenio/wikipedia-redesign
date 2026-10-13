import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SeeAlsoCard } from "@/ui/components/article-sidebar/see-also-card";

const meta = {
  title: "Components/ArticleSidebar/SeeAlsoCard",
  component: SeeAlsoCard,
  parameters: { center: false },
} satisfies Meta<typeof SeeAlsoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
