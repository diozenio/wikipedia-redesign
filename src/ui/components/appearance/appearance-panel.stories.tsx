import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AppearancePanel } from "@/ui/components/appearance/appearance-panel";
import { APPEARANCE_STORAGE_KEY } from "@/ui/lib/appearance";
import { resetAppearance } from "@/ui/testing/story-helpers";

function storedAppearance() {
  const raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

const root = () => document.documentElement;

const meta = {
  title: "Components/Appearance/AppearancePanel",
  component: AppearancePanel,
  args: {
    header: (
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">
          Acessibilidade
        </span>
        <span className="text-[0.8125rem] text-muted-foreground">
          Suas preferências ficam salvas neste navegador.
        </span>
      </div>
    ),
    footerHint: "Esc para fechar",
  },
  beforeEach: resetAppearance,
  decorators: [
    (Story) => (
      <div className="w-[24.5rem] max-w-full rounded-lg border border-border bg-popover p-5 shadow-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppearancePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O painel abre com os valores padrão: tema claro, texto em 100%, espaçamento
 * padrão, fonte para dislexia e leitura facilitada desligadas e os números das
 * notas de rodapé ligados. Todos os controles têm nome acessível.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então os três temas aparecem e o claro está marcado",
      async () => {
        const themes = canvas.getByRole("group", { name: "Tema" });
        await expect(within(themes).getAllByRole("radio")).toHaveLength(3);
        await expect(
          within(themes).getByRole("radio", { name: "Claro" }),
        ).toBeChecked();
      },
    );

    await step("Então o tamanho do texto mostra 100% (Padrão)", async () => {
      await expect(canvas.getByRole("status")).toHaveTextContent("100%Padrão");
    });

    await step("Então o espaçamento padrão está marcado", async () => {
      const spacing = canvas.getByRole("group", {
        name: "Espaçamento do texto",
      });
      await expect(
        within(spacing).getByRole("radio", { name: "Padrão" }),
      ).toBeChecked();
    });

    await step("Então os interruptores mostram o estado padrão", async () => {
      await expect(
        canvas.getByRole("switch", { name: "Fonte para dislexia" }),
      ).not.toBeChecked();
      await expect(
        canvas.getByRole("switch", { name: "Leitura facilitada" }),
      ).not.toBeChecked();
      await expect(
        canvas.getByRole("switch", { name: "Números de notas de rodapé" }),
      ).toBeChecked();
    });

    await step(
      "Então cada interruptor tem uma descrição que explica o que ele faz",
      async () => {
        await expect(
          canvas.getByRole("switch", { name: "Números de notas de rodapé" }),
        ).toHaveAccessibleDescription(
          "Mostra os números das notas no meio do texto. As notas continuam disponíveis no fim do artigo.",
        );
      },
    );
  },
};

/**
 * Quando a pessoa escolhe o tema escuro, a página inteira muda na hora
 * (atributo `data-theme` do `<html>`) e a escolha fica salva no navegador.
 */
export const ChangeTheme: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário escolhe o tema Escuro, então a página fica escura",
      async () => {
        await userEvent.click(canvas.getByRole("radio", { name: "Escuro" }));
        await expect(
          canvas.getByRole("radio", { name: "Escuro" }),
        ).toBeChecked();
        await expect(root()).toHaveAttribute("data-theme", "dark");
      },
    );

    await step("Então a escolha fica salva no navegador", async () => {
      await expect(storedAppearance()).toMatchObject({ theme: "dark" });
    });

    await step(
      "Quando o usuário escolhe Alto contraste, então o tema muda de novo",
      async () => {
        await userEvent.click(
          canvas.getByRole("radio", { name: "Alto contraste" }),
        );
        await expect(root()).toHaveAttribute("data-theme", "high-contrast");
        await expect(storedAppearance()).toMatchObject({
          theme: "high-contrast",
        });
      },
    );
  },
};

/**
 * Os botões "Aumentar texto" e "Diminuir texto" percorrem os tamanhos
 * disponíveis (87,5% a 200%) e ficam desativados ao chegar no limite.
 */
export const ChangeFontSize: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const increase = canvas.getByRole("button", { name: "Aumentar texto" });
    const decrease = canvas.getByRole("button", { name: "Diminuir texto" });
    const output = canvas.getByRole("status");

    await step(
      "Quando o usuário clica em Aumentar texto, então o texto vai para 112,5%",
      async () => {
        await userEvent.click(increase);
        await expect(output).toHaveTextContent("112,5%Médio");
        await expect(root()).toHaveAttribute("data-font-scale", "112.5");
        await expect(storedAppearance()).toMatchObject({ fontScale: 112.5 });
      },
    );

    await step(
      "Quando o usuário aumenta até o máximo, então o botão Aumentar fica desativado",
      async () => {
        await userEvent.click(increase);
        await userEvent.click(increase);
        await userEvent.click(increase);
        await expect(output).toHaveTextContent("200%Máximo");
        await expect(increase).toHaveAttribute("aria-disabled", "true");
      },
    );

    await step(
      "Quando o usuário diminui até o mínimo, então o botão Diminuir fica desativado",
      async () => {
        for (let i = 0; i < 5; i++) await userEvent.click(decrease);
        await expect(output).toHaveTextContent("87,5%Pequeno");
        await expect(decrease).toHaveAttribute("aria-disabled", "true");
        await expect(increase).not.toHaveAttribute("aria-disabled", "true");
      },
    );

    await step(
      "Quando o usuário clica no botão desativado, então nada muda",
      async () => {
        await userEvent.click(decrease);
        await expect(output).toHaveTextContent("87,5%Pequeno");
      },
    );
  },
};

/** As opções de espaçamento mudam o atributo `data-spacing` da página. */
export const ChangeSpacing: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário escolhe Amplo, então o espaçamento fica amplo",
      async () => {
        await userEvent.click(canvas.getByRole("radio", { name: "Amplo" }));
        await expect(root()).toHaveAttribute("data-spacing", "wide");
      },
    );

    await step(
      "Quando o usuário escolhe Extra amplo, então o espaçamento fica extra amplo e é salvo",
      async () => {
        await userEvent.click(
          canvas.getByRole("radio", { name: "Extra amplo" }),
        );
        await expect(root()).toHaveAttribute("data-spacing", "wider");
        await expect(storedAppearance()).toMatchObject({ spacing: "wider" });
      },
    );
  },
};

/**
 * Os três interruptores (fonte para dislexia, leitura facilitada e números de
 * notas de rodapé) ligam e desligam com clique e com o teclado.
 */
export const ToggleSwitches: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const dyslexic = canvas.getByRole("switch", {
      name: "Fonte para dislexia",
    });
    const easyReading = canvas.getByRole("switch", {
      name: "Leitura facilitada",
    });
    const footnotes = canvas.getByRole("switch", {
      name: "Números de notas de rodapé",
    });

    await step(
      "Quando o usuário liga a fonte para dislexia, então a página passa a usar a OpenDyslexic",
      async () => {
        await userEvent.click(dyslexic);
        await expect(dyslexic).toBeChecked();
        await expect(root()).toHaveAttribute("data-dyslexic", "true");
      },
    );

    await step(
      "Quando o usuário desliga a fonte para dislexia, então o atributo some",
      async () => {
        await userEvent.click(dyslexic);
        await expect(dyslexic).not.toBeChecked();
        await expect(root()).not.toHaveAttribute("data-dyslexic");
      },
    );

    await step(
      "Quando o usuário liga a leitura facilitada pelo teclado (Espaço), então ela fica ativa",
      async () => {
        easyReading.focus();
        await userEvent.keyboard(" ");
        await expect(easyReading).toBeChecked();
        await expect(root()).toHaveAttribute("data-easy-reading", "true");
      },
    );

    await step(
      "Quando o usuário desliga os números de notas, então a página marca data-footnotes=false e salva",
      async () => {
        await userEvent.click(footnotes);
        await expect(footnotes).not.toBeChecked();
        await expect(root()).toHaveAttribute("data-footnotes", "false");
        await expect(storedAppearance()).toMatchObject({
          easyReading: true,
          footnoteMarkers: false,
        });
      },
    );
  },
};

/**
 * "Restaurar padrão" desfaz todas as mudanças e apaga as preferências
 * salvas no navegador.
 */
export const ResetToDefaults: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Dado que o usuário mudou tema, tamanho e notas", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "Escuro" }));
      await userEvent.click(
        canvas.getByRole("button", { name: "Aumentar texto" }),
      );
      await userEvent.click(
        canvas.getByRole("switch", { name: "Números de notas de rodapé" }),
      );
      await expect(storedAppearance()).not.toBeNull();
    });

    await step(
      "Quando o usuário clica em Restaurar padrão, então tudo volta ao padrão",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Restaurar padrão" }),
        );
        await waitFor(() =>
          expect(root()).toHaveAttribute("data-theme", "light"),
        );
        await expect(
          canvas.getByRole("radio", { name: "Claro" }),
        ).toBeChecked();
        await expect(canvas.getByRole("status")).toHaveTextContent("100%");
        await expect(
          canvas.getByRole("switch", { name: "Números de notas de rodapé" }),
        ).toBeChecked();
        await expect(root()).toHaveAttribute("data-footnotes", "true");
      },
    );

    await step("Então as preferências salvas são apagadas", async () => {
      await expect(storedAppearance()).toBeNull();
    });
  },
};
