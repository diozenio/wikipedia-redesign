import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeaderActions } from "@/ui/components/header/header-actions";

const meta = {
  title: "Components/Header/HeaderActions",
  component: HeaderActions,
  parameters: { center: false },
} satisfies Meta<typeof HeaderActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
