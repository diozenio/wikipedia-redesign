import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PlayerControls } from "@/ui/components/audio-player/player-controls";

const meta = {
  title: "Components/AudioPlayer/PlayerControls",
  component: PlayerControls,
  args: { isPlaying: true, onTogglePlay: fn(), onSkip: fn() },
} satisfies Meta<typeof PlayerControls>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controles principais do player: voltar 10 segundos, pausar/reproduzir e
 * avançar 10 segundos. Os botões mostram um texto curto e têm um nome
 * acessível completo (por exemplo, "Voltar 10 segundos").
 */
export const Playing: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Voltar, então o áudio volta 10 segundos",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Voltar 10 segundos" }),
        );
        await expect(args.onSkip).toHaveBeenCalledWith(-10);
      },
    );

    await step(
      "Quando o usuário clica em Avançar, então o áudio avança 10 segundos",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Avançar 10 segundos" }),
        );
        await expect(args.onSkip).toHaveBeenCalledWith(10);
      },
    );

    await step(
      "Quando o usuário clica em Pausar, então a reprodução é alternada",
      async () => {
        await userEvent.click(canvas.getByRole("button", { name: "Pausar" }));
        await expect(args.onTogglePlay).toHaveBeenCalledTimes(1);
      },
    );
  },
};

/** Com o áudio pausado, o botão central vira "Reproduzir". */
export const Paused: Story = {
  args: { isPlaying: false },
  play: async ({ canvasElement, step }) => {
    await step("Então o botão central se chama Reproduzir", async () => {
      await expect(
        within(canvasElement).getByRole("button", { name: "Reproduzir" }),
      ).toBeVisible();
    });
  },
};
