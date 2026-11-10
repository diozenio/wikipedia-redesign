import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { HeaderActions } from "@/ui/components/header/header-actions";

const meta = {
  title: "Components/Header/HeaderActions",
  component: HeaderActions,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <div className="@container">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * As ações do cabeçalho: trocar o idioma da interface, abrir a aparência,
 * criar conta e entrar. O seletor de idioma é um menu com opções de rádio, e
 * cada opção tem o atributo `lang` do próprio idioma.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const language = canvas.getByRole("button", {
      name: /Idioma da interface/,
    });

    await step(
      "Então o botão de idioma mostra o idioma atual no nome",
      async () => {
        await expect(language).toHaveAccessibleName(
          "Idioma da interface: Português",
        );
      },
    );

    await step(
      "Quando o usuário abre o seletor de idioma, então aparecem as opções",
      async () => {
        await userEvent.click(language);
        const menu = await screen.findByRole("menu");
        const options = within(menu).getAllByRole("menuitemradio");
        await expect(options.length).toBeGreaterThan(1);
        for (const option of options) {
          await expect(option).toHaveAttribute("lang");
        }
        await expect(
          within(menu).getByRole("menuitemradio", { checked: true }),
        ).toHaveTextContent("Português");
      },
    );

    await step("Quando o usuário aperta Esc, então o menu fecha", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
      );
    });

    await step(
      "Então Aparência, Criar conta e Entrar estão disponíveis",
      async () => {
        await expect(
          canvas.getByRole("button", { name: "Aparência" }),
        ).toBeVisible();
        await expect(
          canvas.getByRole("button", { name: "Criar conta" }),
        ).toBeVisible();
        await expect(
          canvas.getByRole("button", { name: "Entrar" }),
        ).toBeVisible();
      },
    );
  },
};
