import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AnimatedIcon } from "@/ui/components/motion/animated-icon";

function Demo() {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setPlaying((value) => !value)}
      aria-label={playing ? "Pausar" : "Reproduzir"}
      className="flex size-10 items-center justify-center rounded-full border border-border"
    >
      <AnimatedIcon iconKey={playing ? "pause" : "play"}>
        {playing ? (
          <Pause className="size-4" data-testid="icone-pausar" />
        ) : (
          <Play className="size-4" data-testid="icone-reproduzir" />
        )}
      </AnimatedIcon>
    </button>
  );
}

const meta = {
  title: "Components/Motion/AnimatedIcon",
  component: AnimatedIcon,
  args: { iconKey: "play", children: null },
  render: () => <Demo />,
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Troca um ícone por outro com uma pequena animação (giro e escala). Quando
 * a chave (`iconKey`) muda, o ícone antigo sai e o novo entra.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o ícone inicial é o de reproduzir", async () => {
      await expect(canvas.getByTestId("icone-reproduzir")).toBeInTheDocument();
    });

    await step(
      "Quando o usuário clica, então o ícone troca para pausar",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Reproduzir" }),
        );
        await expect(canvas.getByTestId("icone-pausar")).toBeInTheDocument();
        await waitFor(() =>
          expect(
            canvas.queryByTestId("icone-reproduzir"),
          ).not.toBeInTheDocument(),
        );
      },
    );
  },
};
