import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/primitives/card";

const meta = {
  title: "Primitives/Card",
  component: Card,
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cartão com título, descrição, conteúdo e rodapé com ação. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Então título, descrição e ação aparecem", async () => {
      await expect(canvas.getByText("Card title")).toBeVisible();
      await expect(canvas.getByText("Card description")).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Action" }),
      ).toBeVisible();
    });
  },
};

/** Variante compacta. */
export const Small: Story = {
  args: { size: "sm" },
  play: async ({ canvasElement, step }) => {
    await step("Então o cartão compacto mostra o título", async () => {
      await expect(within(canvasElement).getByText("Card title")).toBeVisible();
    });
  },
};
