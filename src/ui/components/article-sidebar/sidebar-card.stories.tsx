import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Info } from "lucide-react";
import { expect, within } from "storybook/test";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";

const meta = {
  title: "Components/ArticleSidebar/SidebarCard",
  component: SidebarCard,
  args: {
    icon: Info,
    title: "Cartão de exemplo",
    children: <p className="px-5 pb-4 text-sm">Conteúdo do cartão.</p>,
  },
} satisfies Meta<typeof SidebarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Base de todos os cartões da barra lateral: uma `section` nomeada pelo
 * próprio título (h2), para aparecer na lista de regiões do leitor de tela.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o cartão é uma região nomeada pelo título h2",
      async () => {
        const region = canvas.getByRole("region", {
          name: "Cartão de exemplo",
        });
        await expect(
          within(region).getByRole("heading", {
            level: 2,
            name: "Cartão de exemplo",
          }),
        ).toBeInTheDocument();
        await expect(
          within(region).getByText("Conteúdo do cartão."),
        ).toBeVisible();
      },
    );
  },
};
