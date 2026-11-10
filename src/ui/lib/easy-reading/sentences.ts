const SENTENCE_PATTERN = /[^.!?…]+(?:[.!?…]+["'”’)\]]*|$)/g;

function segmentWithIntl(text: string): string[] | null {
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return null;

  const segmenter = new Intl.Segmenter("pt", { granularity: "sentence" });
  return Array.from(segmenter.segment(text), (part) => part.segment);
}

export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const parts =
    segmentWithIntl(normalized) ?? normalized.match(SENTENCE_PATTERN) ?? [];

  return parts.map((part) => part.trim()).filter(Boolean);
}

export function chunkSentences(text: string, maxSentences = 2): string[] {
  const sentences = splitSentences(text);
  const size = Math.max(1, Math.floor(maxSentences));
  const chunks: string[] = [];

  for (let index = 0; index < sentences.length; index += size) {
    chunks.push(sentences.slice(index, index + size).join(" "));
  }

  return chunks;
}
