import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeaderSearch } from "@/ui/components/header/header-search";

const meta = {
  title: "Components/Header/HeaderSearch",
  component: HeaderSearch,
  parameters: { center: false },
} satisfies Meta<typeof HeaderSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
