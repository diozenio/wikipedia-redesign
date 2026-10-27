import { createHash } from "node:crypto";
import type {
  ArticleData,
  ArticleSectionData,
} from "@/ui/components/article/types";
import type { RichTextBlock } from "@/ui/components/rich-text/types";

function asSentence(text: string): string {
  return `${text.trim().replace(/[.;:]$/, "")}.`;
}

function listToSpeech(items: string[]): string {
  return items.map(asSentence).join(" ");
}

function blockToSpeech(block: RichTextBlock): string | null {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "heading":
      return asSentence(block.text);
    case "list":
      return listToSpeech(block.items);
    default:
      return null;
  }
}

function isSpeakable(text: string | null): text is string {
  return Boolean(text?.trim());
}

function blocksToSpeech(blocks: RichTextBlock[]): string[] {
  return blocks.map(blockToSpeech).filter(isSpeakable);
}

function sectionToSpeech(section: ArticleSectionData): string[] {
  return [asSentence(section.title), ...blocksToSpeech(section.blocks)];
}

export function buildNarration(article: ArticleData): string {
  return [
    asSentence(article.title),
    ...blocksToSpeech(article.introBlocks),
    ...article.sections.flatMap(sectionToSpeech),
  ].join("\n\n");
}

export function hashNarration(narration: string, voiceId: string): string {
  return createHash("sha256").update(`${voiceId}\n${narration}`).digest("hex");
}
