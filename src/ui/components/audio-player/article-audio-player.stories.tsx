import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ArticleReadButton } from "@/ui/components/article/article-read-button";
import { ArticleAudioPlayer } from "@/ui/components/audio-player/article-audio-player";
import { mockArticle } from "@/ui/providers/mocks/mock-article";
import { MockArticleAudioProvider } from "@/ui/providers/mocks/mock-article-audio-provider";
import { waitForAnimations } from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/AudioPlayer/ArticleAudioPlayer",
  component: ArticleAudioPlayer,
  parameters: { center: false },
} satisfies Meta<typeof ArticleAudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O player só aparece quando o áudio está ativo. Aqui o provedor simulado já
 * começa nessa fase: o player mostra o título do artigo e anuncia o estado
 * ("Reproduzindo", "Pausado"…).
 */
export const Active: Story = {
  render: () => (
    <MockArticleAudioProvider initialPhase="active">
      <ArticleAudioPlayer />
    </MockArticleAudioProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const player = await canvas.findByRole("region", {
      name: "Player do artigo",
    });
    await waitForAnimations(player);

    await step("Então o player mostra o artigo que está tocando", async () => {
      await expect(within(player).getByText(mockArticle.title)).toBeVisible();
      await expect(within(player).getByRole("status")).toHaveTextContent(
        "Reproduzindo",
      );
    });

    await step(
      "Quando o usuário clica em Pausar, então o estado anunciado vira Pausado",
      async () => {
        await userEvent.click(
          within(player).getByRole("button", { name: "Pausar" }),
        );
        await expect(within(player).getByRole("status")).toHaveTextContent(
          "Pausado",
        );
        await expect(
          within(player).getByRole("button", { name: "Reproduzir" }),
        ).toBeVisible();
      },
    );

    await step(
      "Quando o usuário clica em Avançar, então o tempo anda 10 segundos",
      async () => {
        await userEvent.click(
          within(player).getByRole("button", { name: "Avançar 10 segundos" }),
        );
        await expect(
          within(player).getByRole("slider", { name: "Progresso do áudio" }),
        ).toHaveAttribute("aria-valuenow", "10");
      },
    );

    await step(
      "Quando o usuário clica em Fechar, então o player some",
      async () => {
        await userEvent.click(
          within(player).getByRole("button", {
            name: "Fechar o player e parar o áudio",
          }),
        );
        await waitFor(() =>
          expect(
            canvas.queryByRole("region", { name: "Player do artigo" }),
          ).not.toBeInTheDocument(),
        );
      },
    );
  },
};

/**
 * Fluxo completo com o botão Ler: o botão pede o áudio, o player abre e
 * recebe o foco no botão Pausar; ao fechar, o foco volta para o botão Ler.
 */
export const FromReadButton: Story = {
  render: () => (
    <MockArticleAudioProvider stepMs={100}>
      <div className="p-6">
        <ArticleReadButton />
      </div>
      <ArticleAudioPlayer />
    </MockArticleAudioProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando o usuário clica em Ler, então o player abre com o foco em Pausar",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Ler o artigo em voz alta" }),
        );
        const player = await canvas.findByRole("region", {
          name: "Player do artigo",
        });
        await waitFor(() =>
          expect(
            within(player).getByRole("button", { name: "Pausar" }),
          ).toHaveFocus(),
        );
      },
    );

    await step(
      "Quando o usuário fecha o player, então o foco volta para o botão Ler",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", {
            name: "Fechar o player e parar o áudio",
          }),
        );
        const read = await canvas.findByRole("button", {
          name: "Ler o artigo em voz alta",
        });
        await waitFor(() => expect(read).toHaveFocus());
        await waitForAnimations(read);
      },
    );
  },
};

/** Sem áudio ativo, nada é exibido. */
export const Idle: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o player não aparece", async () => {
      await expect(
        within(canvasElement).queryByRole("region", {
          name: "Player do artigo",
        }),
      ).not.toBeInTheDocument();
    });
  },
};
