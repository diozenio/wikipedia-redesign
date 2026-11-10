import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { X } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { PlayerButton } from "@/ui/components/audio-player/player-button";

const meta = {
  title: "Components/AudioPlayer/PlayerButton",
  component: PlayerButton,
  args: {
    icon: <X />,
    label: "Fechar",
    srLabel: "o player e parar o áudio",
    onClick: fn(),
  },
} satisfies Meta<typeof PlayerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Botão do player com ícone e texto curto visível. O `srLabel` completa o
 * nome só para leitores de tela: aqui o nome é "Fechar o player e parar o áudio".
 */
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Fechar o player e parar o áudio",
    });

    await step("Então o texto visível é curto", async () => {
      await expect(canvas.getByText("Fechar")).toBeVisible();
    });

    await step("Quando o usuário clica, então a ação é chamada", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};

/** Variante principal (destacada), usada no botão de reproduzir. */
export const Primary: Story = {
  args: { primary: true, label: "Reproduzir", srLabel: undefined },
  play: async ({ canvasElement, step }) => {
    await step("Então o nome acessível é só o texto visível", async () => {
      await expect(
        within(canvasElement).getByRole("button", { name: "Reproduzir" }),
      ).toBeVisible();
    });
  },
};
