import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TableOfContents } from "@/ui/components/table-of-contents/table-of-contents";

const meta = {
  title: "Components/TableOfContents",
  component: TableOfContents,
  parameters: { center: false },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
