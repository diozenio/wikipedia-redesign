import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Slider } from "@/ui/primitives/slider";

const meta = {
  title: "Primitives/Slider",
  component: Slider,
  args: {
    defaultValue: [40],
    max: 100,
    step: 10,
    thumbLabel: "Intensidade",
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controle deslizante acessível: o pegador tem papel `slider`, um nome
 * (`thumbLabel`) e responde às setas, Home e End.
 */
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const slider = within(canvasElement).getByRole("slider", {
      name: "Intensidade",
    });

    await step("Então o valor inicial é 40", async () => {
      await expect(slider).toHaveAttribute("aria-valuenow", "40");
    });

    await step(
      "Quando o usuário aperta Seta para a direita, então o valor sobe um passo",
      async () => {
        slider.focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(slider).toHaveAttribute("aria-valuenow", "50");
        await expect(args.onValueChange).toHaveBeenCalled();
      },
    );

    await step(
      "Quando o usuário aperta End e Home, então vai ao máximo e ao mínimo",
      async () => {
        await userEvent.keyboard("{End}");
        await expect(slider).toHaveAttribute("aria-valuenow", "100");
        await userEvent.keyboard("{Home}");
        await expect(slider).toHaveAttribute("aria-valuenow", "0");
      },
    );
  },
};

/** Com `getAriaValueText`, o leitor de tela ouve um texto em vez do número. */
export const WithValueText: Story = {
  args: {
    getAriaValueText: (_formatted: string, value: number) =>
      `${value} por cento`,
  },
  play: async ({ canvasElement, step }) => {
    await step("Então o valor é anunciado como texto", async () => {
      await expect(
        within(canvasElement).getByRole("slider", { name: "Intensidade" }),
      ).toHaveAttribute("aria-valuetext", "40 por cento");
    });
  },
};

/** Desativado: não responde ao teclado. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, step }) => {
    await step("Então o controle está desativado", async () => {
      await expect(
        within(canvasElement).getByRole("slider", { name: "Intensidade" }),
      ).toBeDisabled();
    });
  },
};
