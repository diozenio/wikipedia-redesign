import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "@/ui/primitives/separator";

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <Separator {...args} orientation="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="h-8">
      <Separator {...args} orientation="vertical" />
    </div>
  ),
};
