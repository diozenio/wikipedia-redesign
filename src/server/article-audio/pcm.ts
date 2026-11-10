import type { PcmAudio } from "@/server/article-audio/ports";

function totalLength(parts: PcmAudio[]): number {
  return parts.reduce((sum, part) => sum + part.samples.length, 0);
}

export function concatPcm(parts: PcmAudio[]): PcmAudio {
  const samples = new Int16Array(totalLength(parts));
  let offset = 0;

  for (const part of parts) {
    samples.set(part.samples, offset);
    offset += part.samples.length;
  }

  return { samples, sampleRate: parts[0]?.sampleRate ?? 0 };
}
