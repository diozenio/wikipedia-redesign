import { animate } from "motion";

const FADE_OUT_SECONDS = 0.4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export async function tryToPlay(audio: HTMLAudioElement): Promise<boolean> {
  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function togglePlay(audio: HTMLAudioElement) {
  if (audio.paused) void tryToPlay(audio);
  else audio.pause();
}

export function seekTo(audio: HTMLAudioElement, seconds: number) {
  audio.currentTime = clamp(seconds, 0, audio.duration || 0);
}

export function skipBy(audio: HTMLAudioElement, seconds: number) {
  seekTo(audio, audio.currentTime + seconds);
}

export function setVolume(audio: HTMLAudioElement, volume: number) {
  audio.volume = clamp(volume, 0, 1);
  audio.muted = volume === 0;
}

export function toggleMuted(audio: HTMLAudioElement) {
  audio.muted = !audio.muted;
}

function fadeOut(audio: HTMLAudioElement) {
  return animate(audio.volume, 0, {
    duration: FADE_OUT_SECONDS,
    onUpdate: (volume) => {
      audio.volume = volume;
    },
  });
}

export async function fadeOutAndStop(audio: HTMLAudioElement) {
  const originalVolume = audio.volume;
  if (!audio.paused) await fadeOut(audio);

  audio.pause();
  audio.currentTime = 0;
  audio.volume = originalVolume;
}
