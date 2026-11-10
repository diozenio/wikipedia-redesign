import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomePageLayout } from "@/ui/layouts/home-page-layout";

const meta = {
  title: "Layouts/HomePageLayout",
  component: HomePageLayout,
  parameters: { center: false },
} satisfies Meta<typeof HomePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
