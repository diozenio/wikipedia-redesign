import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SiteFooter } from "@/ui/components/footer/site-footer";

const meta = {
  title: "Components/Footer/SiteFooter",
  component: SiteFooter,
  parameters: { center: false },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O rodapé é o landmark `contentinfo`. Cada coluna de links é uma navegação
 * nomeada pelo seu título, e há uma navegação "Informações legais".
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o rodapé é o contentinfo da página", async () => {
      await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
    });

    await step(
      "Então cada grupo de links é uma navegação com nome",
      async () => {
        for (const name of [
          "Sobre",
          "Comunidade",
          "Projetos Wikimedia",
          "Informações legais",
        ]) {
          const nav = canvas.getByRole("navigation", { name });
          await expect(within(nav).getAllByRole("link").length).toBeGreaterThan(
            0,
          );
        }
      },
    );

    await step("Então todo link tem texto e endereço", async () => {
      for (const link of canvas.getAllByRole("link")) {
        await expect(link).toHaveAccessibleName();
        await expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      }
    });
  },
};
