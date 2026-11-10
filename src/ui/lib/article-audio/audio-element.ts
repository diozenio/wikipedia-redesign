export type Playback = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
};

export const EMPTY_PLAYBACK: Playback = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
};

export type AudioElementEvents = {
  onChange: () => void;
  onEnded: () => void;
  onError: () => void;
};

const CHANGE_EVENTS = [
  "play",
  "pause",
  "timeupdate",
  "durationchange",
  "loadedmetadata",
  "volumechange",
];

export function createAudioElement(
  url: string,
  events: AudioElementEvents,
): HTMLAudioElement {
  const audio = new Audio(url);

  for (const name of CHANGE_EVENTS) {
    audio.addEventListener(name, events.onChange);
  }
  audio.addEventListener("ended", events.onEnded);
  audio.addEventListener("error", events.onError);

  return audio;
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function readPlayback(audio: HTMLAudioElement): Playback {
  return {
    isPlaying: !audio.paused,
    currentTime: audio.currentTime,
    duration: finiteOrZero(audio.duration),
    volume: audio.volume,
    muted: audio.muted,
  };
}
