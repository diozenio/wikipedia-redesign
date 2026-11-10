"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArticleAudioContext } from "@/ui/contexts/article-audio-context";
import {
  EMPTY_PLAYBACK,
  type Playback,
} from "@/ui/lib/article-audio/audio-element";
import type {
  ArticleAudio,
  ArticleAudioPhase,
} from "@/ui/lib/article-audio/use-article-audio";

type MockArticleAudioProviderProps = {
  /** Fase inicial (útil para histórias que mostram um estado fixo). */
  initialPhase?: ArticleAudioPhase;
  /** Progresso inicial da geração, de 0 a 100. */
  initialProgress?: number;
  /** "error" simula uma falha ao gerar o áudio depois de clicar em Ler. */
  outcome?: "ready" | "error";
  /** Tempo de cada etapa simulada, em milissegundos. */
  stepMs?: number;
  /** Duração simulada do áudio, em segundos. */
  duration?: number;
  children: ReactNode;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Simula o áudio do artigo sem chamar a API nem tocar som: "Ler" passa por
 * "Preparando…" e "Gerando áudio" e então abre o player, cujos controles
 * apenas atualizam o estado em memória.
 */
export function MockArticleAudioProvider({
  initialPhase = "idle",
  initialProgress = 0,
  outcome = "ready",
  stepMs = 150,
  duration = 180,
  children,
}: MockArticleAudioProviderProps) {
  const [phase, setPhase] = useState<ArticleAudioPhase>(initialPhase);
  const [progress, setProgress] = useState(initialProgress);
  const [playback, setPlayback] = useState<Playback>(
    initialPhase === "active"
      ? { ...EMPTY_PLAYBACK, isPlaying: true, duration }
      : EMPTY_PLAYBACK,
  );
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const later = useCallback((ms: number, action: () => void) => {
    timers.current.push(setTimeout(action, ms));
  }, []);

  const start = useCallback(async () => {
    clearTimers();
    setPhase("requesting");
    setProgress(0);
    later(stepMs, () => {
      setPhase("generating");
      setProgress(50);
    });
    later(stepMs * 2, () => {
      if (outcome === "error") {
        setPhase("error");
        return;
      }
      setProgress(100);
      setPhase("active");
      setPlayback({ ...EMPTY_PLAYBACK, isPlaying: true, duration });
    });
  }, [clearTimers, later, outcome, stepMs, duration]);

  const stop = useCallback(async () => {
    clearTimers();
    setPhase("idle");
    setPlayback(EMPTY_PLAYBACK);
  }, [clearTimers]);

  const value = useMemo<ArticleAudio>(
    () => ({
      phase,
      progress,
      playback,
      start,
      stop,
      play: async () => {
        setPlayback((current) => ({ ...current, isPlaying: true }));
      },
      togglePlay: () =>
        setPlayback((current) => ({
          ...current,
          isPlaying: !current.isPlaying,
        })),
      seek: (seconds: number) =>
        setPlayback((current) => ({
          ...current,
          currentTime: clamp(seconds, 0, current.duration),
        })),
      skip: (seconds: number) =>
        setPlayback((current) => ({
          ...current,
          currentTime: clamp(
            current.currentTime + seconds,
            0,
            current.duration,
          ),
        })),
      changeVolume: (volume: number) =>
        setPlayback((current) => ({
          ...current,
          volume: clamp(volume, 0, 1),
          muted: false,
        })),
      toggleMute: () =>
        setPlayback((current) => ({ ...current, muted: !current.muted })),
    }),
    [phase, progress, playback, start, stop],
  );

  return <ArticleAudioContext value={value}>{children}</ArticleAudioContext>;
}
