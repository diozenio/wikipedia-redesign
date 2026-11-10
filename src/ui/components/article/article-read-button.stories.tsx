import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  ArticleReadButton,
  ArticleReadButtonView,
} from "@/ui/components/article/article-read-button";
import { MockArticleAudioProvider } from "@/ui/providers/mocks/mock-article-audio-provider";
import { waitForAnimations } from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/Article/ArticleReadButton",
  component: ArticleReadButtonView,
  args: { phase: "idle", progress: 0, onClick: fn() },
} satisfies Meta<typeof ArticleReadButtonView>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Estado inicial: o botão mostra "Ler", mas o nome acessível completo é
 * "Ler o artigo em voz alta". Clicar chama a ação de gerar o áudio.
 */
export const Idle: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Ler o artigo em voz alta",
    });
    await waitForAnimations(button);

    await step(
      "Quando o usuário clica em Ler, então a geração do áudio é pedida",
      async () => {
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledTimes(1);
      },
    );
  },
};

/**
 * Enquanto o pedido é enviado, o botão fica ocupado (`aria-disabled`) e
 * ignora novos cliques.
 */
export const Requesting: Story = {
  args: { phase: "requesting" },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Preparando…" });
    await waitForAnimations(button);

    await step(
      "Quando o usuário clica durante o preparo, então nada acontece",
      async () => {
        await expect(button).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(button);
        await expect(args.onClick).not.toHaveBeenCalled();
      },
    );
  },
};

/** Durante a geração, o botão mostra o progresso em porcentagem. */
export const Generating: Story = {
  args: { phase: "generating", progress: 42 },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Gerando áudio/ });

    await step("Então o botão mostra 42% e fica ocupado", async () => {
      await waitFor(() => expect(button).toHaveTextContent("42%"));
      await expect(button).toHaveAttribute("aria-disabled", "true");
    });
    await waitForAnimations(button);
  },
};

/** Se a geração falhar, o botão vira "Tentar de novo" e volta a ser clicável. */
export const Failed: Story = {
  args: { phase: "error" },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Tentar de novo gerar o áudio do artigo",
    });
    await waitForAnimations(button);

    await step(
      "Quando o usuário clica em Tentar de novo, então a geração é pedida outra vez",
      async () => {
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledTimes(1);
      },
    );
  },
};

/**
 * Botão ligado ao contexto de áudio (com o provedor simulado, sem chamar a
 * API). Ao clicar, ele passa por "Preparando…" e "Gerando áudio", anuncia
 * cada fase para leitores de tela e some quando o player abre.
 */
export const Connected: Story = {
  render: () => (
    <MockArticleAudioProvider stepMs={200}>
      <ArticleReadButton />
    </MockArticleAudioProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Ler, então o aviso diz que o áudio está sendo preparado",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Ler o artigo em voz alta" }),
        );
        await waitFor(() =>
          expect(canvasElement.querySelector("[aria-live]")).toHaveTextContent(
            /Preparando o áudio do artigo|Gerando o áudio do artigo/,
          ),
        );
      },
    );

    await step(
      "Então, quando o áudio fica pronto, o botão sai de cena para dar lugar ao player",
      async () => {
        await waitFor(() =>
          expect(canvas.queryByRole("button")).not.toBeInTheDocument(),
        );
      },
    );
  },
};

/** Com o provedor simulado configurado para falhar, o botão termina em "Tentar de novo". */
export const ConnectedFailure: Story = {
  render: () => (
    <MockArticleAudioProvider outcome="error" stepMs={100}>
      <ArticleReadButton />
    </MockArticleAudioProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando a geração falha, então o botão oferece tentar de novo e o erro é anunciado",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Ler o artigo em voz alta" }),
        );
        const retry = await canvas.findByRole("button", {
          name: "Tentar de novo gerar o áudio do artigo",
        });
        await expect(
          canvasElement.querySelector("[aria-live]"),
        ).toHaveTextContent("Não foi possível gerar o áudio do artigo.");
        await waitForAnimations(retry);
      },
    );
  },
};
