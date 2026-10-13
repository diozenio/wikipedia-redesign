import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "@/ui/components/header/site-header";

const meta = {
  title: "Components/Header/SiteHeader",
  component: SiteHeader,
  parameters: { center: false },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
