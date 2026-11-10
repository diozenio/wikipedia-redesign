import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PlayerTimeline } from "@/ui/components/audio-player/player-timeline";

const meta = {
  title: "Components/AudioPlayer/PlayerTimeline",
  component: PlayerTimeline,
  args: { currentTime: 754, duration: 2410, onSeek: fn() },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Linha do tempo do áudio: um controle deslizante chamado "Progresso do
 * áudio" que fala o tempo por extenso ("12 minutos e 34 segundos de 40
 * minutos e 10 segundos"). As setas do teclado avançam e voltam.
 */
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Progresso do áudio" });

    await step(
      "Então o tempo é descrito por extenso para leitores de tela",
      async () => {
        await expect(slider).toHaveAttribute(
          "aria-valuetext",
          "12 minutos e 34 segundos de 40 minutos e 10 segundos",
        );
      },
    );

    await step("Então os tempos visíveis aparecem nos dois lados", async () => {
      await expect(canvas.getByText("12:34")).toBeVisible();
      await expect(canvas.getByText("40:10")).toBeVisible();
    });

    await step(
      "Quando o usuário aperta Seta para a direita, então o áudio avança 1 segundo",
      async () => {
        slider.focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(args.onSeek).toHaveBeenCalledWith(755);
      },
    );
  },
};

/** Antes de o áudio carregar (duração 0), a linha do tempo fica desativada. */
export const WithoutDuration: Story = {
  args: { currentTime: 0, duration: 0 },
  play: async ({ canvasElement, step }) => {
    await step("Então o controle deslizante está desativado", async () => {
      const slider = within(canvasElement).getByRole("slider", {
        name: "Progresso do áudio",
      });
      await expect(slider).toBeDisabled();
    });
  },
};
