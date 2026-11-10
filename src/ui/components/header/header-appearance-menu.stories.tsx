import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeaderAppearanceMenu } from "@/ui/components/header/header-appearance-menu";

const meta = {
  title: "Components/Header/HeaderAppearanceMenu",
  component: HeaderAppearanceMenu,
} satisfies Meta<typeof HeaderAppearanceMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
