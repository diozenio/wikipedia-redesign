import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "@/ui/components/footer/site-footer";

const meta = {
  title: "Components/Footer/SiteFooter",
  component: SiteFooter,
  parameters: { center: false },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
