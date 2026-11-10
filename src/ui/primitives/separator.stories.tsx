import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
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

/** Separador horizontal. */
export const Horizontal: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então há um separador horizontal", async () => {
      const separator = canvasElement.querySelector('[data-slot="separator"]');
      await expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });
  },
  render: (args) => (
    <div className="w-64">
      <Separator {...args} orientation="horizontal" />
    </div>
  ),
};

/** Separador vertical. */
export const Vertical: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então há um separador vertical", async () => {
      const separator = canvasElement.querySelector('[data-slot="separator"]');
      await expect(separator).toHaveAttribute("data-orientation", "vertical");
    });
  },
  render: (args) => (
    <div className="h-8">
      <Separator {...args} orientation="vertical" />
    </div>
  ),
};
