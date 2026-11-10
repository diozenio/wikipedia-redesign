import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { AppearanceScript } from "@/ui/components/appearance/appearance-script";
import { APPEARANCE_SCRIPT, APPEARANCE_STORAGE_KEY } from "@/ui/lib/appearance";
import { resetAppearance } from "@/ui/testing/story-helpers";

/** Executa o script exatamente como o navegador faria antes da primeira pintura. */
function runAppearanceScript() {
  new Function(APPEARANCE_SCRIPT)();
}

function store(value: Record<string, unknown>) {
  window.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(value));
}

const root = () => document.documentElement;

const meta = {
  title: "Components/Appearance/AppearanceScript",
  component: AppearanceScript,
  parameters: {
    docs: {
      description: {
        component:
          "Script embutido no `<head>` que aplica as preferências salvas (tema, tamanho do texto, espaçamento, fonte para dislexia, leitura facilitada e números de notas) no `<html>` **antes** da primeira pintura, evitando o “piscar” do tema claro. Ele só é renderizado no servidor; no navegador o componente não mostra nada. As histórias abaixo executam o mesmo código e conferem os atributos `data-*` resultantes.",
      },
    },
  },
  beforeEach: resetAppearance,
  render: () => (
    <pre className="max-w-[40rem] overflow-x-auto rounded-md bg-muted p-4 text-xs whitespace-pre-wrap text-foreground">
      {APPEARANCE_SCRIPT}
    </pre>
  ),
} satisfies Meta<typeof AppearanceScript>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sem nada salvo, o script aplica os valores padrão (notas de rodapé ligadas). */
export const Defaults: Story = {
  play: async ({ step }) => {
    await step(
      "Quando não há preferências salvas, então os atributos padrão são aplicados",
      async () => {
        runAppearanceScript();
        await expect(root()).toHaveAttribute("data-theme", "light");
        await expect(root()).toHaveAttribute("data-font-scale", "100");
        await expect(root()).toHaveAttribute("data-spacing", "default");
        await expect(root()).not.toHaveAttribute("data-dyslexic");
        await expect(root()).toHaveAttribute("data-easy-reading", "false");
        await expect(root()).toHaveAttribute("data-footnotes", "true");
      },
    );
  },
};

/** Com preferências salvas, o script aplica cada uma delas. */
export const StoredPreferences: Story = {
  play: async ({ step }) => {
    await step(
      "Quando há preferências salvas, então o html já nasce com elas",
      async () => {
        store({
          theme: "dark",
          fontScale: 150,
          spacing: "wider",
          dyslexicFont: true,
          easyReading: true,
          footnoteMarkers: false,
        });
        runAppearanceScript();
        await expect(root()).toHaveAttribute("data-theme", "dark");
        await expect(root()).toHaveAttribute("data-font-scale", "150");
        await expect(root()).toHaveAttribute("data-spacing", "wider");
        await expect(root()).toHaveAttribute("data-dyslexic", "true");
        await expect(root()).toHaveAttribute("data-easy-reading", "true");
        await expect(root()).toHaveAttribute("data-footnotes", "false");
      },
    );
  },
};

/** Valores inválidos ou dados corrompidos são ignorados, sem quebrar a página. */
export const InvalidValues: Story = {
  play: async ({ step }) => {
    await step(
      "Quando os valores salvos são inválidos, então os padrões são usados",
      async () => {
        store({ theme: "roxo", fontScale: 999, spacing: "enorme" });
        runAppearanceScript();
        await expect(root()).toHaveAttribute("data-theme", "light");
        await expect(root()).toHaveAttribute("data-font-scale", "100");
        await expect(root()).toHaveAttribute("data-spacing", "default");
      },
    );

    await step(
      "Quando o JSON salvo está corrompido, então o script não falha",
      async () => {
        window.localStorage.setItem(APPEARANCE_STORAGE_KEY, "{não é json");
        await expect(runAppearanceScript).not.toThrow();
        await expect(root()).toHaveAttribute("data-footnotes", "true");
      },
    );
  },
};
