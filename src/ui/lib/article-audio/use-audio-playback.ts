"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fadeOutAndStop,
  seekTo,
  setVolume,
  skipBy,
  toggleMuted,
  togglePlay,
  tryToPlay,
} from "@/ui/lib/article-audio/audio-controls";
import {
  createAudioElement,
  EMPTY_PLAYBACK,
  type Playback,
  readPlayback,
} from "@/ui/lib/article-audio/audio-element";

type Callbacks = {
  onEnded: () => void;
  onError: () => void;
};

export function useAudioPlayback({ onEnded, onError }: Callbacks) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playback, setPlayback] = useState<Playback>(EMPTY_PLAYBACK);

  useEffect(() => () => audioRef.current?.pause(), []);

  const sync = useCallback(() => {
    if (audioRef.current) setPlayback(readPlayback(audioRef.current));
  }, []);

  const handleError = useCallback(() => {
    audioRef.current = null;
    onError();
  }, [onError]);

  const load = useCallback(
    (url: string) => {
      audioRef.current ??= createAudioElement(url, {
        onChange: sync,
        onEnded,
        onError: handleError,
      });
      return audioRef.current;
    },
    [handleError, onEnded, sync],
  );

  const withAudio = useCallback((action: (audio: HTMLAudioElement) => void) => {
    if (audioRef.current) action(audioRef.current);
  }, []);

  const play = useCallback(
    async (url: string) => {
      await tryToPlay(load(url));
    },
    [load],
  );

  const stop = useCallback(async () => {
    if (audioRef.current) await fadeOutAndStop(audioRef.current);
  }, []);

  return {
    playback,
    play,
    stop,
    togglePlay: useCallback(() => withAudio(togglePlay), [withAudio]),
    seek: useCallback(
      (seconds: number) => withAudio((audio) => seekTo(audio, seconds)),
      [withAudio],
    ),
    skip: useCallback(
      (seconds: number) => withAudio((audio) => skipBy(audio, seconds)),
      [withAudio],
    ),
    changeVolume: useCallback(
      (volume: number) => withAudio((audio) => setVolume(audio, volume)),
      [withAudio],
    ),
    toggleMute: useCallback(() => withAudio(toggleMuted), [withAudio]),
  };
}
