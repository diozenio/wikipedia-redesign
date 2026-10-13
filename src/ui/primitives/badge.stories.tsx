import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/ui/primitives/badge";

const variants = ["default", "secondary", "destructive", "outline"] as const;

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
