import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/ui/primitives/input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { placeholder: "Type something..." },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { "aria-invalid": true } };
