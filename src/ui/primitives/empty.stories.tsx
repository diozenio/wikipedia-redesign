import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/primitives/empty";

const meta = {
  title: "Primitives/Empty",
  component: Empty,
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia className="text-5xl font-semibold">404</EmptyMedia>
        <EmptyTitle>Nothing here</EmptyTitle>
        <EmptyDescription>There is no content to show yet.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Go back</Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bloco de estado vazio com mídia, título, descrição e ação. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Então título, descrição e botão aparecem", async () => {
      await expect(canvas.getByText("Nothing here")).toBeVisible();
      await expect(
        canvas.getByText("There is no content to show yet."),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Go back" }),
      ).toBeVisible();
    });
  },
};
