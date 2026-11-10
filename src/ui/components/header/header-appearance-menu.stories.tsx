import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { HeaderAppearanceMenu } from "@/ui/components/header/header-appearance-menu";
import { resetAppearance } from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/Header/HeaderAppearanceMenu",
  component: HeaderAppearanceMenu,
  beforeEach: resetAppearance,
} satisfies Meta<typeof HeaderAppearanceMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No computador, o botão "Aparência" abre um balão (popover) com o painel de
 * preferências. As mudanças valem na hora e o Esc fecha o balão devolvendo o
 * foco ao botão.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Aparência" });

    await step(
      "Quando o usuário clica em Aparência, então o painel abre",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Aparência" });
        await expect(dialog).toHaveAccessibleDescription(
          "Suas preferências ficam salvas neste navegador.",
        );
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
      },
    );

    await step(
      "Quando o usuário escolhe o tema Escuro, então a página muda na hora",
      async () => {
        const dialog = screen.getByRole("dialog", { name: "Aparência" });
        await userEvent.click(
          within(dialog).getByRole("radio", { name: "Escuro" }),
        );
        await expect(document.documentElement).toHaveAttribute(
          "data-theme",
          "dark",
        );
      },
    );

    await step(
      "Quando o usuário aperta Esc, então o painel fecha e o foco volta ao botão",
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

/**
 * No celular, o mesmo painel abre como uma gaveta que sobe da parte de baixo
 * da tela.
 */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário toca em Aparência, então a gaveta com o painel abre",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Aparência" }),
        );
        const dialog = await screen.findByRole("dialog", { name: "Aparência" });
        await expect(
          within(dialog).getByRole("switch", { name: "Leitura facilitada" }),
        ).toBeInTheDocument();
        // A gaveta (sheet) é usada no lugar do balão em telas pequenas.
        await expect(dialog).toHaveAttribute("data-slot", "sheet-content");
      },
    );

    await step(
      "Quando o usuário aperta Esc, então a gaveta fecha",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(
          canvas.getByRole("button", { name: "Aparência" }),
        ).toHaveFocus();
      },
    );
  },
};
