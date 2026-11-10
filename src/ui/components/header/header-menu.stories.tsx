import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { HeaderMenu } from "@/ui/components/header/header-menu";
import { siteNavItems } from "@/ui/components/site-navigation/site-nav-items";

const meta = {
  title: "Components/Header/HeaderMenu",
  component: HeaderMenu,
} satisfies Meta<typeof HeaderMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O botão "Abrir menu" abre uma gaveta lateral com a navegação do site.
 * A gaveta é um diálogo com título, tem uma região de navegação nomeada e,
 * ao fechar com Esc, o foco volta para o botão que a abriu.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir menu" });

    await step(
      "Quando o usuário clica em Abrir menu, então a gaveta Menu abre",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Menu" });
        await expect(dialog).toBeVisible();
      },
    );

    await step(
      "Então a gaveta tem a navegação do site com todos os links",
      async () => {
        const dialog = screen.getByRole("dialog", { name: "Menu" });
        const nav = within(dialog).getByRole("navigation", {
          name: "Navegação do site",
        });
        for (const item of siteNavItems) {
          await expect(
            within(nav).getByRole("link", { name: item.label }),
          ).toBeInTheDocument();
        }
      },
    );

    await step(
      "Quando o usuário aperta Esc, então a gaveta fecha e o foco volta ao botão",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};

/** O botão "Fechar menu" dentro da gaveta também fecha e devolve o foco. */
export const CloseWithButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir menu" });

    await step(
      "Quando o usuário abre o menu e clica em Fechar menu, então a gaveta fecha",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Menu" });
        await userEvent.click(
          within(dialog).getByRole("button", { name: "Fechar menu" }),
        );
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};
