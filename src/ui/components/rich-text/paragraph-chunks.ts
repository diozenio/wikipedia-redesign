import type { RichTextInline } from "@/ui/components/rich-text/types";
import { chunkSentences } from "@/ui/lib/easy-reading/sentences";

type Range = { start: number; end: number };

function rangesOf(text: string, chunks: string[]): Range[] | null {
  const ranges: Range[] = [];
  let cursor = 0;
  for (const chunk of chunks) {
    const start = text.indexOf(chunk, cursor);
    if (start === -1) return null;
    cursor = start + chunk.length;
    ranges.push({ start, end: cursor });
  }
  return ranges;
}

function pushText(target: RichTextInline[], text: string) {
  if (!text) return;
  const last = target[target.length - 1];
  if (last?.type === "text") last.text += text;
  else target.push({ type: "text", text });
}

export function chunkSegments(
  text: string,
  segments: RichTextInline[],
  maxSentences = 2,
): RichTextInline[][] {
  const chunks = chunkSentences(text, maxSentences);
  const ranges = chunks.length > 1 ? rangesOf(text, chunks) : null;
  if (!ranges) return [segments];

  const result: RichTextInline[][] = ranges.map(() => []);
  let position = 0;

  for (const segment of segments) {
    if (segment.type === "note") {
      const index = ranges.findLastIndex((range) => range.start < position);
      result[Math.max(index, 0)].push(segment);
      continue;
    }
    const end = position + segment.text.length;
    ranges.forEach((range, index) => {
      const from = Math.max(position, range.start);
      const to = Math.min(end, range.end);
      if (from < to) {
        pushText(result[index], text.slice(from, to));
      }
    });
    position = end;
  }

  return result.filter((chunk) => chunk.length > 0);
}
