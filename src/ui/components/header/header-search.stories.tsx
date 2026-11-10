import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { HeaderSearch } from "@/ui/components/header/header-search";

const meta = {
  title: "Components/Header/HeaderSearch",
  component: HeaderSearch,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <div className="p-4 pb-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O campo de pesquisa tem rótulo "Pesquisar na Wikipédia", segue o padrão
 * combobox (lista fechada no início) e anuncia o atalho Ctrl+K.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o campo é um combobox com rótulo e a lista começa fechada",
      async () => {
        const input = canvas.getByRole("combobox", {
          name: "Pesquisar na Wikipédia",
        });
        await expect(input).toHaveAttribute("aria-expanded", "false");
        await expect(input).toHaveAttribute(
          "aria-keyshortcuts",
          "Control+K Meta+K",
        );
        await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
      },
    );
  },
};

/**
 * Ao digitar, aparecem sugestões de artigos (vindas do provedor de pesquisa
 * simulado) e um aviso para leitores de tela diz quantos resultados existem.
 */
export const ShowsSuggestions: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", {
      name: "Pesquisar na Wikipédia",
    });

    await step(
      "Quando o usuário digita “sistema”, então a lista de sugestões abre",
      async () => {
        await userEvent.type(input, "sistema");
        const listbox = await canvas.findByRole("listbox", {
          name: "Sugestões de artigos",
        });
        await expect(input).toHaveAttribute("aria-expanded", "true");
        await expect(input).toHaveAttribute("aria-controls", listbox.id);
        await expect(
          await within(listbox).findByRole("option", {
            name: /Sistema de informação/,
          }),
        ).toBeVisible();
      },
    );

    await step(
      "Então o aviso escondido anuncia a quantidade de resultados",
      async () => {
        await waitFor(() =>
          expect(canvas.getByRole("status")).toHaveTextContent(
            "1 resultado disponível.",
          ),
        );
      },
    );

    await step(
      "Quando o usuário digita algo sem resultados, então aparece a mensagem de nada encontrado",
      async () => {
        await userEvent.clear(input);
        await userEvent.type(input, "xyzxyz");
        await waitFor(() =>
          expect(canvas.getByRole("status")).toHaveTextContent(
            "Nenhum artigo encontrado para “xyzxyz”.",
          ),
        );
        await expect(canvas.queryAllByRole("option")).toHaveLength(0);
      },
    );
  },
};

/**
 * As setas do teclado percorrem as sugestões sem tirar o foco do campo
 * (`aria-activedescendant`) e o Esc fecha a lista; um segundo Esc limpa o texto.
 */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", {
      name: "Pesquisar na Wikipédia",
    });

    await step(
      "Dado que o usuário digitou “a” e há várias sugestões",
      async () => {
        await userEvent.type(input, "a");
        await waitFor(() =>
          expect(canvas.getAllByRole("option").length).toBeGreaterThan(1),
        );
      },
    );

    await step(
      "Quando o usuário aperta Seta para baixo, então a primeira sugestão fica ativa",
      async () => {
        await userEvent.keyboard("{ArrowDown}");
        const [first] = canvas.getAllByRole("option");
        await expect(input).toHaveAttribute("aria-activedescendant", first.id);
        await expect(first).toHaveAttribute("aria-selected", "true");
        await expect(input).toHaveFocus();
      },
    );

    await step(
      "Quando o usuário aperta Seta para cima, então a seleção volta para a última sugestão",
      async () => {
        await userEvent.keyboard("{ArrowUp}");
        const options = canvas.getAllByRole("option");
        await expect(input).toHaveAttribute(
          "aria-activedescendant",
          options[options.length - 1].id,
        );
      },
    );

    await step(
      "Quando o usuário aperta Esc, então a lista fecha mas o texto continua",
      async () => {
        await userEvent.keyboard("{Escape}");
        await expect(input).toHaveAttribute("aria-expanded", "false");
        await expect(input).not.toHaveAttribute("aria-activedescendant");
        await expect(input).toHaveValue("a");
      },
    );

    await step(
      "Quando o usuário aperta Esc de novo, então o texto é apagado",
      async () => {
        await userEvent.keyboard("{Escape}");
        await expect(input).toHaveValue("");
      },
    );
  },
};

/** O atalho Ctrl+K (ou ⌘K) leva o foco para o campo de pesquisa de qualquer lugar. */
export const KeyboardShortcut: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", {
      name: "Pesquisar na Wikipédia",
    });

    await step(
      "Quando o usuário aperta Ctrl+K, então o foco vai para a pesquisa",
      async () => {
        await expect(input).not.toHaveFocus();
        await userEvent.keyboard("{Control>}k{/Control}");
        await expect(input).toHaveFocus();
      },
    );
  },
};

/** O botão "Limpar pesquisa" apaga o texto e devolve o foco para o campo. */
export const ClearButton: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", {
      name: "Pesquisar na Wikipédia",
    });

    await step(
      "Quando o usuário digita algo, então aparece o botão Limpar pesquisa",
      async () => {
        await expect(
          canvas.queryByRole("button", { name: "Limpar pesquisa" }),
        ).not.toBeInTheDocument();
        await userEvent.type(input, "Brasil");
      },
    );

    await step(
      "Quando o usuário clica em Limpar pesquisa, então o campo fica vazio e focado",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Limpar pesquisa" }),
        );
        await expect(input).toHaveValue("");
        await expect(input).toHaveFocus();
      },
    );
  },
};
