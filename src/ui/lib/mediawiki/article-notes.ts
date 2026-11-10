import type {
  RichTextBlock,
  RichTextInline,
} from "@/ui/components/rich-text/types";
import type {
  MediaWikiInline,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";

export function noteTargetId(number: number) {
  return `nota-${number}`;
}

export function createNoteRegistry() {
  const calls = new Map<number, number>();

  return {
    mapSegments(segments: MediaWikiInline[]): RichTextInline[] {
      return segments.map((segment) => {
        if (segment.type === "text") return segment;
        const count = (calls.get(segment.number) ?? 0) + 1;
        calls.set(segment.number, count);
        return {
          type: "note",
          number: segment.number,
          id:
            count === 1
              ? `ref-${segment.number}`
              : `ref-${segment.number}-${count}`,
          targetId: noteTargetId(segment.number),
        };
      });
    },
    referencesOf(content: MediaWikiSection[]): RichTextBlock | null {
      const texts = new Map<number, string>();
      for (const block of content.flatMap((section) => section.blocks)) {
        if (block.type !== "references") continue;
        for (const item of block.items) {
          if (!texts.has(item.number)) texts.set(item.number, item.text);
        }
      }
      if (texts.size === 0) return null;

      return {
        type: "references",
        items: Array.from(texts, ([number, text]) => ({
          number,
          id: noteTargetId(number),
          text,
          backlinkId: calls.has(number) ? `ref-${number}` : null,
        })).sort((a, b) => a.number - b.number),
      };
    },
  };
}

export type NoteRegistry = ReturnType<typeof createNoteRegistry>;
