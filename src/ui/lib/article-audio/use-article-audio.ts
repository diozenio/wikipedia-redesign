"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AudioStatus,
  requestAudio,
} from "@/ui/lib/article-audio/article-audio-api";
import { useAudioPlayback } from "@/ui/lib/article-audio/use-audio-playback";
import { waitForAudio } from "@/ui/lib/article-audio/wait-for-audio";

export type ArticleAudioPhase =
  | "idle"
  | "requesting"
  | "generating"
  | "active"
  | "error";

function useAbortOnUnmount() {
  const abortRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    return () => controller.abort();
  }, []);

  return abortRef;
}

export function useArticleAudio(articleId: string) {
  const [phase, setPhase] = useState<ArticleAudioPhase>("idle");
  const [progress, setProgress] = useState(0);
  const abortRef = useAbortOnUnmount();

  const close = useCallback(() => setPhase("idle"), []);
  const fail = useCallback(() => setPhase("error"), []);
  const player = useAudioPlayback({ onEnded: close, onError: fail });

  const showGenerating = useCallback((status: AudioStatus) => {
    setPhase("generating");
    setProgress(status.progress ?? 0);
  }, []);

  const playReady = useCallback(
    async (status: AudioStatus) => {
      if (!status.url) return fail();
      setPhase("active");
      await player.play(status.url);
    },
    [fail, player.play],
  );

  const start = useCallback(async () => {
    const signal = abortRef.current.signal;
    setPhase("requesting");
    setProgress(0);

    try {
      const firstStatus = await requestAudio(articleId, signal);
      await playReady(
        await waitForAudio(articleId, firstStatus, showGenerating, signal),
      );
    } catch {
      if (!signal.aborted) fail();
    }
  }, [abortRef, articleId, fail, playReady, showGenerating]);

  const stop = useCallback(async () => {
    close();
    await player.stop();
  }, [close, player.stop]);

  return { ...player, phase, progress, start, stop };
}

export type ArticleAudio = ReturnType<typeof useArticleAudio>;
