import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PlayerVolume } from "@/ui/components/audio-player/player-volume";

const meta = {
  title: "Components/AudioPlayer/PlayerVolume",
  component: PlayerVolume,
  args: {
    volume: 0.8,
    muted: false,
    onVolumeChange: fn(),
    onToggleMute: fn(),
  },
} satisfies Meta<typeof PlayerVolume>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Volume: um botão "Silenciar" do tipo liga/desliga (`aria-pressed`) e um
 * controle deslizante "Volume" que fala o valor em porcentagem.
 */
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Volume" });

    await step("Então o volume é anunciado como 80%", async () => {
      await expect(slider).toHaveAttribute("aria-valuetext", "80%");
    });

    await step(
      "Quando o usuário aperta Seta para a esquerda, então o volume diminui",
      async () => {
        slider.focus();
        await userEvent.keyboard("{ArrowLeft}");
        await expect(args.onVolumeChange).toHaveBeenCalledWith(0.75);
      },
    );

    await step(
      "Quando o usuário clica em Silenciar, então o som é desligado",
      async () => {
        const mute = canvas.getByRole("button", { name: "Silenciar" });
        await expect(mute).toHaveAttribute("aria-pressed", "false");
        await userEvent.click(mute);
        await expect(args.onToggleMute).toHaveBeenCalledTimes(1);
      },
    );
  },
};

/** Silenciado: o botão aparece pressionado e o volume é anunciado como 0%. */
export const Muted: Story = {
  args: { muted: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então Silenciar está pressionado e o volume é 0%", async () => {
      await expect(
        canvas.getByRole("button", { name: "Silenciar" }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        canvas.getByRole("slider", { name: "Volume" }),
      ).toHaveAttribute("aria-valuetext", "0%");
    });
  },
};
