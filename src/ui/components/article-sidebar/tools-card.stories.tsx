import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  expect,
  screen,
  spyOn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { ToolsCard } from "@/ui/components/article-sidebar/tools-card";
import { mockArticle } from "@/ui/providers/mocks/mock-article";

/**
 * O cartão usa APIs do navegador (área de transferência e impressão). Nas
 * histórias elas são substituídas por versões falsas, para que o teste não
 * dependa de permissão do navegador nem abra a janela de impressão.
 */
function stubBrowserApis() {
  const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const print = spyOn(window, "print").mockImplementation(() => {});
  return () => {
    writeText.mockRestore();
    print.mockRestore();
  };
}

const meta = {
  title: "Components/ArticleSidebar/ToolsCard",
  component: ToolsCard,
  parameters: { center: false },
  beforeEach: stubBrowserApis,
} satisfies Meta<typeof ToolsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Ferramentas do artigo: citar, baixar PDF, imprimir, link permanente e item
 * no Wikidata. Ações que fazem algo na página são botões; as que levam a
 * outro endereço são links.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então as ações aparecem com o tipo certo de elemento",
      async () => {
        await expect(
          canvas.getByRole("button", { name: "Citar esta página" }),
        ).toBeVisible();
        await expect(
          canvas.getByRole("button", { name: "Versão para impressão" }),
        ).toBeVisible();
        await expect(
          canvas.getByRole("button", { name: "Link permanente" }),
        ).toBeVisible();
        await expect(
          canvas
            .getByRole("link", { name: "Baixar como PDF" })
            .getAttribute("href"),
        ).toContain("/api/rest_v1/page/pdf/");
        await expect(
          canvas
            .getByRole("link", { name: "Item no Wikidata" })
            .getAttribute("href"),
        ).toContain("wikidata.org");
      },
    );
  },
};

/** "Citar esta página" copia uma citação pronta e mostra o aviso “Citação copiada.”. */
export const CopyCitation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Citar esta página, então a citação vai para a área de transferência",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Citar esta página" }),
        );
        await waitFor(() =>
          expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            expect.stringContaining(
              `${mockArticle.title}. In: Wikipédia, a enciclopédia livre.`,
            ),
          ),
        );
      },
    );

    await step("Então aparece o aviso Citação copiada.", async () => {
      await expect(
        await screen.findByText("Citação copiada."),
      ).toBeInTheDocument();
    });
  },
};

/** "Link permanente" copia o endereço desta versão do artigo. */
export const CopyPermalink: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Link permanente, então o link é copiado e um aviso aparece",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Link permanente" }),
        );
        await waitFor(() =>
          expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            expect.stringContaining("pt.wikipedia.org"),
          ),
        );
        await expect(
          await screen.findByText("Link permanente copiado."),
        ).toBeInTheDocument();
      },
    );
  },
};

/** Se o navegador bloquear a cópia, aparece um aviso de erro. */
export const CopyFails: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("negado"),
    );

    await step("Quando a cópia falha, então o usuário é avisado", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Citar esta página" }),
      );
      await expect(
        await screen.findByText(
          "Não foi possível copiar para a área de transferência.",
        ),
      ).toBeInTheDocument();
    });
  },
};

/** "Versão para impressão" abre a impressão do navegador. */
export const Print: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Versão para impressão, então a impressão é chamada",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Versão para impressão" }),
        );
        await expect(window.print).toHaveBeenCalledTimes(1);
      },
    );
  },
};
