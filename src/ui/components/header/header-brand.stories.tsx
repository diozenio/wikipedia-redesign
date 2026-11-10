import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { HeaderBrand } from "@/ui/components/header/header-brand";

const meta = {
  title: "Components/Header/HeaderBrand",
  component: HeaderBrand,
  parameters: { center: false },
} satisfies Meta<typeof HeaderBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A marca mostra o botão do menu e o logotipo. O logotipo é um link com nome
 * descritivo para a página principal.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o botão Abrir menu aparece antes do logotipo",
      async () => {
        await expect(
          canvas.getByRole("button", { name: "Abrir menu" }),
        ).toBeVisible();
      },
    );

    await step(
      "Então o logotipo é um link para a página principal",
      async () => {
        await expect(
          canvas.getByRole("link", { name: /Página principal/ }),
        ).toHaveAttribute("href", "/");
      },
    );
  },
};
