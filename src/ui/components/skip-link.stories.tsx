import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SkipLink } from "@/ui/components/skip-link";

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  parameters: { center: false },
  args: { targetId: "conteudo" },
  render: (args) => (
    <div>
      <SkipLink {...args} />
      <nav aria-label="Navegação de exemplo">
        <a href="#exemplo">Um link do cabeçalho</a>
      </nav>
      <main id="conteudo" tabIndex={-1} className="p-6">
        <p>Conteúdo principal</p>
      </main>
    </div>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Pular para o conteúdo" é o primeiro item da página para quem usa teclado.
 * Ele fica invisível até receber foco e leva direto ao conteúdo principal.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Pular para o conteúdo" });

    await step("Então o link começa escondido visualmente", async () => {
      // Classe sr-only: recortado (clip) e fora do fluxo, mas ainda lido por leitores de tela.
      await expect(getComputedStyle(link).position).toBe("absolute");
      await expect(getComputedStyle(link).clipPath).not.toBe("none");
    });

    await step(
      "Quando o usuário aperta Tab, então o link é o primeiro a receber foco e aparece",
      async () => {
        await userEvent.tab();
        await expect(link).toHaveFocus();
        await expect(getComputedStyle(link).position).toBe("fixed");
        await expect(link.getBoundingClientRect().width).toBeGreaterThan(40);
      },
    );

    await step(
      "Então ele aponta para o conteúdo principal (#conteudo)",
      async () => {
        await expect(link).toHaveAttribute("href", "#conteudo");
        await expect(canvasElement.querySelector("#conteudo")).toHaveRole(
          "main",
        );
      },
    );

    await step(
      "Então o alvo pode receber foco (tabindex=-1), para o leitor continuar dali",
      async () => {
        // Ativar o link de verdade mudaria o endereço do iframe de testes; por
        // isso conferimos que o alvo existe e é focável.
        await expect(canvas.getByRole("main")).toHaveAttribute(
          "tabindex",
          "-1",
        );
      },
    );
  },
};
