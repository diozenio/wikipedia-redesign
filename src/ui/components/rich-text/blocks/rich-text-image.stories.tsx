import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { RichTextImage } from "@/ui/components/rich-text/blocks/rich-text-image";
import { SAMPLE_IMAGE_SRC } from "@/ui/testing/sample-image";

const ALT = "Paisagem com sol e montanhas";
/** Endereço que nunca carrega: um PNG com bytes inválidos. */
const BROKEN_SRC = "data:image/png;base64,AAAA";
const CAPTION = "Ilustração de exemplo usada nos testes.";

const meta = {
  title: "Components/RichText/RichTextImage",
  component: RichTextImage,
  args: {
    src: SAMPLE_IMAGE_SRC,
    alt: ALT,
    caption: CAPTION,
    width: 640,
    height: 360,
  },
} satisfies Meta<typeof RichTextImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Imagem do artigo com texto alternativo e legenda (`figcaption`). A imagem
 * é um botão "Ampliar imagem: …" que abre uma visualização em tela cheia.
 * Fechar (pelo botão ou pelo Esc) devolve o foco para a imagem.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: `Ampliar imagem: ${ALT}`,
    });

    await step("Então a imagem tem texto alternativo e legenda", async () => {
      await expect(canvas.getByRole("img", { name: ALT })).toBeInTheDocument();
      await expect(canvasElement.querySelector("figcaption")).toHaveTextContent(
        CAPTION,
      );
    });

    await step(
      "Quando o usuário clica na imagem, então ela abre ampliada com a legenda",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog");
        await expect(dialog).toHaveAccessibleName(CAPTION);
        await expect(dialog).toHaveAccessibleDescription(CAPTION);
        await waitFor(() =>
          expect(within(dialog).getByRole("img", { name: ALT })).toBeVisible(),
        );
      },
    );

    await step(
      "Quando o usuário clica em Fechar, então a imagem ampliada fecha e o foco volta",
      async () => {
        await userEvent.click(
          within(screen.getByRole("dialog")).getByRole("button", {
            name: "Fechar",
          }),
        );
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );

    await step(
      "Quando o usuário abre de novo e aperta Esc, então também fecha",
      async () => {
        await userEvent.click(trigger);
        await screen.findByRole("dialog");
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};

/** Sem legenda: não há `figcaption` e o diálogo usa o texto alternativo como título. */
export const WithoutCaption: Story = {
  args: { caption: "" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então não há legenda", async () => {
      await expect(canvasElement.querySelector("figcaption")).toBeNull();
    });

    await step(
      "Quando o usuário amplia a imagem, então o diálogo é nomeado pelo texto alternativo",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: `Ampliar imagem: ${ALT}` }),
        );
        await expect(await screen.findByRole("dialog")).toHaveAccessibleName(
          ALT,
        );
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
      },
    );
  },
};

/**
 * Quando a imagem não carrega, aparece um aviso desenhado pelo próprio site
 * ("Imagem indisponível") no lugar do ícone de imagem quebrada do navegador.
 * O aviso continua descrevendo a imagem para leitores de tela e não pode ser
 * ampliado. A legenda continua embaixo.
 */
export const BrokenImage: Story = {
  args: { src: BROKEN_SRC },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando a imagem não carrega, então aparece o aviso Imagem indisponível com a descrição acessível",
      async () => {
        const fallback = await canvas.findByRole("img", {
          name: `Imagem indisponível: ${ALT}`,
        });
        await expect(fallback).toHaveTextContent("Imagem indisponível");
        await expect(canvasElement.querySelector("img")).toBeNull();
      },
    );

    await step(
      "Então não há botão de ampliar e a legenda continua",
      async () => {
        await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
        await expect(
          canvasElement.querySelector("figcaption"),
        ).toHaveTextContent(CAPTION);
      },
    );
  },
};

/** Imagem quebrada e sem legenda: só o aviso, sem `figcaption` vazio. */
export const BrokenImageWithoutCaption: Story = {
  args: { src: BROKEN_SRC, caption: "" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Quando a imagem não carrega e não há legenda, então só o aviso aparece",
      async () => {
        await expect(
          await canvas.findByRole("img", {
            name: `Imagem indisponível: ${ALT}`,
          }),
        ).toBeVisible();
        await expect(canvasElement.querySelector("figcaption")).toBeNull();
        await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
      },
    );
  },
};
