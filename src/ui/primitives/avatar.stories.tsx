import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
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

/** Avatar com as iniciais como alternativa quando não há foto. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então as iniciais aparecem", async () => {
      await expect(within(canvasElement).getByText("AL")).toBeVisible();
    });
  },
};

/** Os três tamanhos disponíveis. */
export const Sizes: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então aparecem três avatares", async () => {
      await expect(within(canvasElement).getAllByText("AL")).toHaveLength(3);
    });
  },
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
