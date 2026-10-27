"use client";

import { BookOpen, LoaderCircle, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedPercent } from "@/ui/components/motion/animated-percent";
import { useArticleAudioContext } from "@/ui/contexts/article-audio-context";
import type { ArticleAudioPhase } from "@/ui/lib/article-audio/use-article-audio";

type ButtonPhase = Exclude<ArticleAudioPhase, "active">;

const CONTENT: Record<
  ButtonPhase,
  { icon: typeof BookOpen; label: string; announcement: string }
> = {
  idle: { icon: BookOpen, label: "Ler", announcement: "" },
  requesting: {
    icon: LoaderCircle,
    label: "Preparando…",
    announcement: "Preparando o áudio do artigo.",
  },
  generating: {
    icon: LoaderCircle,
    label: "Gerando áudio",
    announcement: "Gerando o áudio do artigo. Isso pode levar alguns minutos.",
  },
  error: { icon: RotateCcw, label: "Tentar de novo", announcement: "" },
};

function isBusy(phase: ButtonPhase): boolean {
  return phase === "requesting" || phase === "generating";
}

function GenerationFill({ progress }: { progress: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-y-0 left-0 bg-primary/15"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: `${progress}%`, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    />
  );
}

function ButtonLabel({ phase }: { phase: ButtonPhase }) {
  const { icon: Icon, label } = CONTENT[phase];

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={phase}
        className="relative flex items-center gap-1.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
      >
        <Icon className={isBusy(phase) ? "size-4 animate-spin" : "size-4"} />
        {label}
      </motion.span>
    </AnimatePresence>
  );
}

function ProgressBadge({ progress }: { progress: number }) {
  return (
    <motion.span
      layout
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <AnimatedPercent value={progress} />
    </motion.span>
  );
}

export function ArticleReadButtonView({
  phase,
  progress,
  onClick,
}: {
  phase: ButtonPhase;
  progress: number;
  onClick?: () => void;
}) {
  const generating = phase === "generating";

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      disabled={isBusy(phase)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative flex items-center gap-1.5 overflow-hidden rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-progress"
    >
      <AnimatePresence>
        {generating && <GenerationFill progress={progress} />}
      </AnimatePresence>
      <ButtonLabel phase={phase} />
      <AnimatePresence mode="popLayout">
        {generating && <ProgressBadge progress={progress} />}
      </AnimatePresence>
    </motion.button>
  );
}

function PhaseAnnouncement({ phase }: { phase: ArticleAudioPhase }) {
  const announcement = phase === "active" ? "" : CONTENT[phase].announcement;

  return (
    <span className="sr-only" aria-live="polite">
      {announcement}
    </span>
  );
}

export function ArticleReadButton() {
  const { phase, progress, start } = useArticleAudioContext();

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        {phase !== "active" && (
          <ArticleReadButtonView
            key="read-button"
            phase={phase}
            progress={progress}
            onClick={start}
          />
        )}
      </AnimatePresence>
      <PhaseAnnouncement phase={phase} />
    </>
  );
}
