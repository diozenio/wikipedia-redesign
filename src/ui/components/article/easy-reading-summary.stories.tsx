import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import {
  EasyReadingSummary,
  EasyReadingSummaryCard,
} from "@/ui/components/article/easy-reading-summary";
import { MockArticleSummaryProvider } from "@/ui/providers/mocks/mock-article-summary-provider";
import {
  resetAppearance,
  withStoredAppearance,
} from "@/ui/testing/story-helpers";

const INTRO_TEXT =
  "O Brasil é o maior país da América do Sul. Tem mais de 200 milhões de habitantes. A capital é Brasília, e a maior cidade é São Paulo.";

const SUMMARY =
  "O Brasil é o maior país da América do Sul. Mais de 200 milhões de pessoas moram lá. A capital é Brasília.";

const meta = {
  title: "Components/Article/EasyReadingSummaryCard",
  component: EasyReadingSummaryCard,
  args: {
    introText: INTRO_TEXT,
    state: { status: "ready", summary: SUMMARY },
  },
  beforeEach: resetAppearance,
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EasyReadingSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resumo pronto: título "Resumo simplificado", o texto e o aviso de que foi gerado por IA. */
export const Ready: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o cartão é uma região complementar com o título Resumo simplificado",
      async () => {
        const card = canvas.getByRole("complementary", {
          name: "Resumo simplificado",
        });
        await expect(card).toHaveAttribute("aria-busy", "false");
      },
    );

    await step("Então o resumo e o aviso de IA aparecem", async () => {
      await expect(canvas.getByText(SUMMARY)).toBeVisible();
      await expect(
        canvas.getByText("Gerado por IA a partir da introdução do artigo."),
      ).toBeVisible();
    });
  },
};

/** Enquanto o resumo é gerado, o cartão fica `aria-busy` e avisa “Gerando resumo…”. */
export const Loading: Story = {
  args: { state: { status: "loading" } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o cartão está ocupado e avisa que o resumo está sendo gerado",
      async () => {
        const card = canvas.getByRole("complementary", {
          name: "Resumo simplificado",
        });
        await expect(card).toHaveAttribute("aria-busy", "true");
        await expect(canvas.getByText("Gerando resumo…")).toBeInTheDocument();
      },
    );
  },
};

/**
 * Sem chave de IA configurada, o cartão mostra o começo da introdução como
 * alternativa e explica por que não há resumo.
 */
export const NotConfigured: Story = {
  args: { state: { status: "unavailable", reason: "not_configured" } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o título vira Introdução do artigo e mostra as duas primeiras frases",
      async () => {
        await expect(
          canvas.getByRole("complementary", { name: "Introdução do artigo" }),
        ).toBeInTheDocument();
        await expect(
          canvas.getByText(
            "O Brasil é o maior país da América do Sul. Tem mais de 200 milhões de habitantes.",
          ),
        ).toBeVisible();
        await expect(
          canvas.getByText(/Configure OPENROUTER_API_KEY/),
        ).toBeVisible();
      },
    );
  },
};

/** Se a IA falhar, o cartão também cai para a introdução e diz que não deu para gerar agora. */
export const Failed: Story = {
  args: { state: { status: "unavailable", reason: "error" } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então aparece a introdução e a mensagem de erro", async () => {
      await expect(
        canvas.getByRole("complementary", { name: "Introdução do artigo" }),
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Não foi possível gerar o resumo por IA agora."),
      ).toBeVisible();
    });
  },
};

/**
 * Componente completo: só aparece com a leitura facilitada ligada e pede o
 * resumo pelo contexto (aqui, o provedor simulado — nenhuma IA é chamada).
 */
export const ConnectedToProvider: Story = {
  beforeEach: withStoredAppearance({ easyReading: true }),
  render: () => (
    <MockArticleSummaryProvider
      result={{ status: "ready", summary: SUMMARY }}
      delayMs={100}
    >
      <EasyReadingSummary />
    </MockArticleSummaryProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o resumo chega do provedor, então ele aparece no cartão",
      async () => {
        await expect(await canvas.findByText(SUMMARY)).toBeVisible();
        await expect(
          canvas.getByRole("complementary", { name: "Resumo simplificado" }),
        ).toHaveAttribute("aria-busy", "false");
      },
    );
  },
};

/** Com a leitura facilitada desligada, o resumo não é exibido nem pedido. */
export const HiddenWhenEasyReadingIsOff: Story = {
  render: () => <EasyReadingSummary />,
  play: async ({ canvasElement, step }) => {
    await step("Então nada é exibido", async () => {
      await expect(
        within(canvasElement).queryByRole("complementary"),
      ).not.toBeInTheDocument();
    });
  },
};
