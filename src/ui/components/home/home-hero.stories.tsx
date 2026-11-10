import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeHero } from "@/ui/components/home/home-hero";

const meta = {
  title: "Components/Home/HomeHero",
  component: HomeHero,
  parameters: { center: false },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
