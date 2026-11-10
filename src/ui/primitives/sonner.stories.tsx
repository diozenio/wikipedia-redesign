import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { expect, screen, userEvent, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import { Toaster } from "@/ui/primitives/sonner";

const meta = {
  title: "Primitives/Toaster",
  component: Toaster,
  render: () => (
    <div className="flex gap-2">
      <Button onClick={() => toast.success("Tudo certo.")}>
        Mostrar sucesso
      </Button>
      <Button variant="outline" onClick={() => toast.error("Algo deu errado.")}>
        Mostrar erro
      </Button>
    </div>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Avisos temporários (toasts). O `<Toaster />` já vem do provedor da
 * aplicação; aqui os botões disparam um aviso de sucesso e um de erro, que
 * aparecem numa região "Notifications" anunciada por leitores de tela.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário dispara um sucesso, então o aviso aparece",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Mostrar sucesso" }),
        );
        await expect(
          await screen.findByText("Tudo certo."),
        ).toBeInTheDocument();
      },
    );

    await step(
      "Quando o usuário dispara um erro, então o aviso de erro aparece",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Mostrar erro" }),
        );
        await expect(
          await screen.findByText("Algo deu errado."),
        ).toBeInTheDocument();
      },
    );

    await step(
      "Então os avisos ficam numa região que é anunciada",
      async () => {
        const region = screen.getByRole("region", { name: /Notifications/ });
        await expect(region).toHaveAttribute("aria-live", "polite");
      },
    );
  },
};
