import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback } from "@/ui/primitives/avatar";

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
