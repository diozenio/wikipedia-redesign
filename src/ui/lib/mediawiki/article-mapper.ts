import type {
  ArticleData,
  ArticleSectionData,
} from "@/ui/components/article/types";
import type { RichTextBlock } from "@/ui/components/rich-text/types";
import type {
  MediaWikiBlock,
  MediaWikiPage,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";

const SKIPPED_HEADINGS = new Set([
  "Ver também",
  "Referências",
  "Ligações externas",
]);

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mergeAdjacentLists(blocks: MediaWikiBlock[]): MediaWikiBlock[] {
  const merged: MediaWikiBlock[] = [];

  for (const block of blocks) {
    const previous = merged[merged.length - 1];
    if (
      block.type === "list" &&
      previous?.type === "list" &&
      previous.ordered === block.ordered
    ) {
      previous.items.push(...block.items);
      continue;
    }
    merged.push(
      block.type === "list" ? { ...block, items: [...block.items] } : block,
    );
  }

  return merged;
}

function mapBlock(block: MediaWikiBlock): RichTextBlock | null {
  switch (block.type) {
    case "p":
      return { type: "paragraph", text: block.text };
    case "list":
      return { type: "list", ordered: block.ordered, items: block.items };
    case "table":
      return { type: "table", rows: block.rows };
    case "image":
      return {
        type: "image",
        src: block.src,
        caption: block.caption,
        width: block.width,
        height: block.height,
      };
    default:
      return null;
  }
}

function mapBlocks(blocks: MediaWikiBlock[]): RichTextBlock[] {
  return mergeAdjacentLists(blocks)
    .map(mapBlock)
    .filter((block): block is RichTextBlock => block !== null);
}

export function mapMediaWikiArticleToDomain(
  page: MediaWikiPage,
  content: MediaWikiSection[],
): ArticleData {
  const introSection = content.find((section) => section.id === "0");
  const introBlocks = mapBlocks(
    (introSection?.blocks ?? []).filter((block) => block.type !== "table"),
  );

  const topicCategory = page.categories.find(
    (category) => !category.title.startsWith("Categoria:!"),
  );
  const badges = page.categories
    .filter((category) => !category.title.startsWith("Categoria:!"))
    .slice(0, 3)
    .map((category) => category.title.replace(/^Categoria:/, ""));

  const sections: ArticleSectionData[] = [];

  for (let i = 0; i < content.length; i++) {
    const section = content[i];
    if (section.level !== "h2" || !section.heading) continue;
    if (SKIPPED_HEADINGS.has(section.heading)) continue;

    const blocks = mapBlocks(section.blocks);
    const subsections: ArticleSectionData["subsections"] = [];

    let j = i + 1;
    while (j < content.length && content[j].level === "h3") {
      const subSection = content[j];
      if (subSection.heading) {
        const subId = slugify(subSection.heading);
        blocks.push({ type: "heading", id: subId, text: subSection.heading });
        subsections.push({ id: subId, title: subSection.heading });
      }
      blocks.push(...mapBlocks(subSection.blocks));
      j++;
    }

    sections.push({
      id: slugify(section.heading),
      title: section.heading,
      subsections,
      blocks,
    });
  }

  return {
    breadcrumb: [
      { label: "Wikipédia" },
      ...(topicCategory
        ? [{ label: topicCategory.title.replace(/^Categoria:/, "") }]
        : []),
      { label: page.title },
    ],
    title: page.title,
    origin: "Origem: Wikipédia, a enciclopédia livre.",
    badges,
    meta: {
      languages: page.languageCount,
      lastEditedLabel: "Última edição há 3 semanas",
      watchersLabel: "Acompanhar página",
    },
    introBlocks,
    sections,
  };
}
