import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: variants },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Botão padrão: clicar ou apertar Enter/Espaço chama a ação. */
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Button",
    });

    await step("Quando o usuário clica, então a ação é chamada", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step(
      "Quando o usuário aperta Enter com o foco no botão, então a ação é chamada de novo",
      async () => {
        button.focus();
        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledTimes(2);
      },
    );
  },
};

/** Todas as variantes visuais. */
export const Variants: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então há um botão para cada variante", async () => {
      await expect(within(canvasElement).getAllByRole("button")).toHaveLength(
        variants.length,
      );
    });
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Todos os tamanhos. */
export const Sizes: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então há quatro tamanhos", async () => {
      await expect(within(canvasElement).getAllByRole("button")).toHaveLength(
        4,
      );
    });
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/** Desativado: não pode ser clicado. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement, step }) => {
    await step(
      "Quando o usuário tenta clicar, então nada acontece",
      async () => {
        const button = within(canvasElement).getByRole("button", {
          name: "Button",
        });
        await expect(button).toBeDisabled();
        await userEvent.click(button, { pointerEventsCheck: 0 });
        await expect(args.onClick).not.toHaveBeenCalled();
      },
    );
  },
};
