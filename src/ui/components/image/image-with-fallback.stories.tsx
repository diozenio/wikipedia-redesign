import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { ImageWithFallback } from "@/ui/components/image/image-with-fallback";
import { SAMPLE_IMAGE_SRC } from "@/ui/testing/sample-image";

const ALT = "Paisagem com sol e montanhas";
/** Endereço que nunca carrega: um PNG com bytes inválidos. */
const BROKEN_SRC = "data:image/png;base64,AAAA";

const meta = {
  title: "Components/Image/ImageWithFallback",
  component: ImageWithFallback,
  args: {
    src: SAMPLE_IMAGE_SRC,
    alt: ALT,
    width: 320,
    height: 180,
    className: "rounded-md",
  },
} satisfies Meta<typeof ImageWithFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Imagem usada no artigo e na capa da barra lateral. Quando carrega, é um
 * `<img>` comum com texto alternativo.
 */
export const Loaded: Story = {
  play: async ({ canvasElement, step }) => {
    await step(
      "Quando a imagem carrega, então ela aparece com o texto alternativo",
      async () => {
        const image = within(canvasElement).getByRole("img", { name: ALT });
        await expect(image.tagName).toBe("IMG");
        await waitFor(() =>
          expect((image as HTMLImageElement).naturalWidth).toBeGreaterThan(0),
        );
      },
    );
  },
};

/**
 * Quando a imagem não carrega, aparece o quadro “Imagem indisponível” com
 * ícone, nas mesmas proporções da imagem (320×180), e o nome acessível
 * continua descrevendo o que a imagem mostraria.
 */
export const Broken: Story = {
  args: { src: BROKEN_SRC },
  play: async ({ canvasElement, step }) => {
    await step(
      "Quando a imagem não carrega, então aparece o aviso Imagem indisponível com a descrição",
      async () => {
        const fallback = await within(canvasElement).findByRole("img", {
          name: `Imagem indisponível: ${ALT}`,
        });
        await expect(fallback).toHaveTextContent("Imagem indisponível");
        await expect(canvasElement.querySelector("img")).toBeNull();
      },
    );

    await step(
      "Então o aviso mantém a proporção da imagem original",
      async () => {
        const fallback = within(canvasElement).getByRole("img");
        await expect(fallback.style.aspectRatio).toBe("320 / 180");
      },
    );
  },
};

/** Sem largura e altura conhecidas, o aviso usa a proporção 16:9. */
export const BrokenWithoutDimensions: Story = {
  args: { src: BROKEN_SRC, width: undefined, height: undefined },
  play: async ({ canvasElement, step }) => {
    await step(
      "Quando a imagem sem dimensões não carrega, então o aviso usa 16:9",
      async () => {
        const fallback = await within(canvasElement).findByRole("img", {
          name: `Imagem indisponível: ${ALT}`,
        });
        await expect(fallback.style.aspectRatio).toBe("16 / 9");
      },
    );
  },
};
