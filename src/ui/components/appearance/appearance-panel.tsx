"use client";

import {
  AArrowDown,
  AArrowUp,
  Check,
  type LucideIcon,
  RotateCcw,
} from "lucide-react";
import { type ReactNode, useId } from "react";
import { useAppearance } from "@/ui/contexts/appearance-context";
import {
  FONT_SCALES,
  type FontScale,
  type Spacing,
  type Theme,
} from "@/ui/lib/appearance";
import { cn } from "@/ui/lib/utils";
import { Button } from "@/ui/primitives/button";

const THEME_OPTIONS: { value: Theme; label: string; swatch: string }[] = [
  {
    value: "light",
    label: "Claro",
    swatch: "bg-white text-neutral-950",
  },
  {
    value: "dark",
    label: "Escuro",
    swatch: "bg-neutral-950 text-neutral-50",
  },
  {
    value: "high-contrast",
    label: "Alto contraste",
    swatch: "bg-black text-[#ffd600]",
  },
];

const FONT_SCALE_LABELS: Record<FontScale, string> = {
  87.5: "Pequeno",
  100: "Padrão",
  112.5: "Médio",
  125: "Grande",
  150: "Muito grande",
  200: "Máximo",
};

const SPACING_OPTIONS: { value: Spacing; label: string }[] = [
  { value: "default", label: "Padrão" },
  { value: "wide", label: "Amplo" },
  { value: "wider", label: "Extra amplo" },
];

const optionFocusRing =
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring";

function formatPercent(scale: FontScale) {
  return `${scale.toLocaleString("pt-BR")}%`;
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[0.8125rem] font-semibold text-foreground">
      {children}
    </span>
  );
}

function StepButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="size-10"
      aria-label={label}
      disabled={disabled}
      focusableWhenDisabled
      onClick={onClick}
    >
      <Icon />
    </Button>
  );
}

export function AppearancePanel({
  header,
  footerHint,
}: {
  header: ReactNode;
  footerHint?: ReactNode;
}) {
  const id = useId();
  const { appearance, updateAppearance, resetAppearance } = useAppearance();
  const { theme, fontScale, spacing, dyslexicFont } = appearance;
  const scaleIndex = FONT_SCALES.indexOf(fontScale);

  function stepFontScale(direction: -1 | 1) {
    const next = FONT_SCALES[scaleIndex + direction];
    if (next !== undefined) updateAppearance({ fontScale: next });
  }

  return (
    <div className="flex flex-col gap-5">
      {header}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2">
          <GroupLabel>Tema</GroupLabel>
        </legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2">
          {THEME_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "group/option flex cursor-pointer flex-col gap-2 rounded-md border border-border p-2 has-checked:border-foreground has-checked:ring-1 has-checked:ring-foreground",
                optionFocusRing,
              )}
            >
              <input
                type="radio"
                name={`${id}-theme`}
                value={option.value}
                checked={theme === option.value}
                onChange={() => updateAppearance({ theme: option.value })}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-10 items-center justify-center rounded-sm border border-border text-[0.9375rem] font-semibold",
                  option.swatch,
                )}
              >
                Aa
              </span>
              <span className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-foreground group-has-checked/option:font-semibold">
                <Check className="hidden size-3.5 shrink-0 group-has-checked/option:block" />
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2">
          <GroupLabel>Tamanho do texto</GroupLabel>
        </legend>
        <div className="flex items-center gap-2">
          <StepButton
            label="Diminuir texto"
            icon={AArrowDown}
            disabled={scaleIndex === 0}
            onClick={() => stepFontScale(-1)}
          />
          <output
            aria-live="polite"
            className="flex min-h-10 flex-1 flex-col items-center justify-center rounded-md bg-muted px-2 py-1 text-center"
          >
            <span className="text-[0.9375rem] font-semibold text-foreground">
              {formatPercent(fontScale)}
            </span>
            <span className="text-[0.6875rem] text-muted-foreground">
              {FONT_SCALE_LABELS[fontScale]}
            </span>
          </output>
          <StepButton
            label="Aumentar texto"
            icon={AArrowUp}
            disabled={scaleIndex === FONT_SCALES.length - 1}
            onClick={() => stepFontScale(1)}
          />
        </div>
        <div aria-hidden className="flex gap-1">
          {FONT_SCALES.map((scale, index) => (
            <span
              key={scale}
              className={cn(
                "h-1 flex-1 rounded-full",
                index <= scaleIndex ? "bg-foreground" : "bg-border",
              )}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2">
          <GroupLabel>Espaçamento do texto</GroupLabel>
        </legend>
        <div className="flex gap-0.5 rounded-md bg-muted p-0.75">
          {SPACING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex-1 cursor-pointer rounded-[calc(var(--radius-md)-2px)] px-2 py-1.5 text-center text-[0.8125rem] font-medium text-muted-foreground has-checked:bg-background has-checked:text-foreground has-checked:shadow-xs high-contrast:has-checked:ring-1 high-contrast:has-checked:ring-foreground",
                optionFocusRing,
              )}
            >
              <input
                type="radio"
                name={`${id}-spacing`}
                value={option.value}
                checked={spacing === option.value}
                onChange={() => updateAppearance({ spacing: option.value })}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <p className="text-xs leading-normal text-muted-foreground">
          Aumenta a altura das linhas e o espaço entre letras, palavras e
          parágrafos.
        </p>
      </fieldset>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-0.5">
          <span
            id={`${id}-dyslexic`}
            className="text-[0.8125rem] font-semibold text-foreground"
          >
            Fonte para dislexia
          </span>
          <span
            id={`${id}-dyslexic-description`}
            className="text-xs text-muted-foreground"
          >
            Usa a OpenDyslexic em todo o site.
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={dyslexicFont}
          aria-labelledby={`${id}-dyslexic`}
          aria-describedby={`${id}-dyslexic-description`}
          onClick={() => updateAppearance({ dyslexicFont: !dyslexicFont })}
          className="inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-muted-foreground p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-primary"
        >
          <span className="size-4 rounded-full bg-background shadow-xs transition-transform in-aria-checked:translate-x-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <Button variant="ghost" onClick={resetAppearance}>
          <RotateCcw className="size-3.5" />
          Restaurar padrão
        </Button>
        {footerHint && (
          <span className="text-xs text-muted-foreground">{footerHint}</span>
        )}
      </div>
    </div>
  );
}
