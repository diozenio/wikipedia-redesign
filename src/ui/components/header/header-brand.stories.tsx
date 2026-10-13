import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeaderBrand } from "@/ui/components/header/header-brand";

const meta = {
  title: "Components/Header/HeaderBrand",
  component: HeaderBrand,
  parameters: { center: false },
} satisfies Meta<typeof HeaderBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
