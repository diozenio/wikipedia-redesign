import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { HeaderLanguageSwitcher } from "@/ui/components/header/header-language-switcher";

const meta = {
  title: "Components/Header/HeaderLanguageSwitcher",
  component: HeaderLanguageSwitcher,
} satisfies Meta<typeof HeaderLanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Seletor do idioma da interface. O botão diz o idioma atual no nome e abre
 * um menu com opções de rádio; cada opção é escrita no próprio idioma e tem
 * `lang`. Escolher uma opção troca o idioma; o Esc fecha o menu.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o botão mostra o idioma atual", async () => {
      await expect(
        canvas.getByRole("button", { name: "Idioma da interface: Português" }),
      ).toBeVisible();
    });

    await step(
      "Quando o usuário abre o menu, então os idiomas aparecem como opções",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: /Idioma da interface/ }),
        );
        const menu = await screen.findByRole("menu");
        const english = within(menu).getByRole("menuitemradio", {
          name: "English",
        });
        await expect(english).toHaveAttribute("lang", "en");
        await expect(english).toHaveAttribute("aria-checked", "false");
      },
    );

    await step(
      "Quando o usuário escolhe English, então o botão passa a mostrar English",
      async () => {
        const english = screen.getByRole("menuitemradio", { name: "English" });
        await userEvent.click(english);
        await expect(english).toHaveAttribute("aria-checked", "true");
        // Opções de rádio mantêm o menu aberto (padrão do Base UI); o Esc fecha.
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
        );
        await expect(
          canvas.getByRole("button", { name: "Idioma da interface: English" }),
        ).toBeVisible();
      },
    );
  },
};
