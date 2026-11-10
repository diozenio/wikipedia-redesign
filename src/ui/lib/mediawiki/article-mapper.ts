import type {
  ArticleData,
  ArticleInfobox,
  ArticleSectionData,
} from "@/ui/components/article/types";
import type { RichTextBlock } from "@/ui/components/rich-text/types";
import { mapLanguages } from "@/ui/lib/mediawiki/article-languages";
import {
  createNoteRegistry,
  type NoteRegistry,
} from "@/ui/lib/mediawiki/article-notes";
import { formatRelativeTime } from "@/ui/lib/mediawiki/relative-time";
import type {
  MediaWikiBlock,
  MediaWikiImage,
  MediaWikiPage,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";

const SKIPPED_HEADINGS = new Set(["Ver também", "Ligações externas"]);
const NOTES_HEADINGS = new Set([
  "Referências",
  "Notas",
  "Notas e referências",
  "Notas e Referências",
  "Fontes",
]);

export const NOTES_SECTION = {
  id: "notas-e-referencias",
  title: "Notas e referências",
};

type MapContext = { title: string; notes: NoteRegistry };

export function toArticleKey(title: string) {
  return title.replaceAll(" ", "_");
}

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

function mapImage(image: MediaWikiImage, title: string) {
  return {
    src: image.src,
    alt: image.alt || image.caption || `Imagem do artigo ${title}`,
    caption: image.caption,
    width: image.width,
    height: image.height,
  };
}

function mapBlock(
  block: MediaWikiBlock,
  context: MapContext,
): RichTextBlock | null {
  switch (block.type) {
    case "p":
      return block.segments
        ? {
            type: "paragraph",
            text: block.text,
            segments: context.notes.mapSegments(block.segments),
          }
        : { type: "paragraph", text: block.text };
    case "list":
      return { type: "list", ordered: block.ordered, items: block.items };
    case "table":
      return { type: "table", rows: block.rows };
    case "image":
      return { type: "image", ...mapImage(block, context.title) };
    default:
      return null;
  }
}

function mapBlocks(
  blocks: MediaWikiBlock[],
  context: MapContext,
): RichTextBlock[] {
  return mergeAdjacentLists(blocks)
    .map((block) => mapBlock(block, context))
    .filter((block): block is RichTextBlock => block !== null);
}

function mapInfobox(
  content: MediaWikiSection[],
  title: string,
): ArticleInfobox | null {
  const intro = content.find((section) => section.id === "0");
  const infobox = intro?.blocks.find((block) => block.type === "infobox");
  if (!infobox || infobox.type !== "infobox") return null;

  return {
    caption: infobox.caption,
    image: infobox.image ? mapImage(infobox.image, title) : null,
    rows: infobox.rows,
  };
}

function isSubsection(section: MediaWikiSection | undefined) {
  return section?.level === "h3" || section?.level === "h4";
}

function mapSectionBody(
  content: MediaWikiSection[],
  index: number,
  context: MapContext,
) {
  const blocks = mapBlocks(content[index].blocks, context);
  const subsections: ArticleSectionData["subsections"] = [];

  for (let j = index + 1; isSubsection(content[j]); j++) {
    const { heading, level } = content[j];
    if (heading) {
      const id = slugify(heading);
      const isLevel3 = level === "h3";
      blocks.push({
        type: "heading",
        id,
        text: heading,
        level: isLevel3 ? 3 : 4,
      });
      if (isLevel3) subsections.push({ id, title: heading });
    }
    blocks.push(...mapBlocks(content[j].blocks, context));
  }

  return { blocks, subsections };
}

function mapSections(
  content: MediaWikiSection[],
  context: MapContext,
): ArticleSectionData[] {
  const sections: ArticleSectionData[] = [];
  const notesBodies: number[] = [];

  content.forEach((section, index) => {
    if (section.level !== "h2" || !section.heading) return;
    if (SKIPPED_HEADINGS.has(section.heading)) return;
    if (NOTES_HEADINGS.has(section.heading)) {
      notesBodies.push(index);
      return;
    }

    sections.push({
      id: slugify(section.heading),
      title: section.heading,
      ...mapSectionBody(content, index, context),
    });
  });

  const extras = notesBodies.map((index) =>
    mapSectionBody(content, index, context),
  );
  const references = context.notes.referencesOf(content);
  const blocks = [
    ...(references ? [references] : []),
    ...extras.flatMap((extra) => extra.blocks),
  ];

  if (blocks.length > 0) {
    sections.push({
      ...NOTES_SECTION,
      subsections: extras.flatMap((extra) => extra.subsections),
      blocks,
    });
  }

  return sections;
}

function lastEditedOf(page: MediaWikiPage) {
  const timestamp = page.revisions?.[0]?.timestamp ?? null;
  const relative = timestamp ? formatRelativeTime(timestamp) : null;

  return {
    lastEditedAt: relative ? timestamp : null,
    lastEditedLabel: relative
      ? `Última edição ${relative}`
      : "Data da última edição indisponível",
  };
}

export function mapMediaWikiArticleToDomain(
  page: MediaWikiPage,
  content: MediaWikiSection[],
): ArticleData {
  const context: MapContext = {
    title: page.title,
    notes: createNoteRegistry(),
  };
  const introSection = content.find((section) => section.id === "0");
  const introBlocks = mapBlocks(introSection?.blocks ?? [], context);
  const sections = mapSections(content, context);
  const languages = mapLanguages(page.langlinks);

  const topicCategory = page.categories.find(
    (category) => !category.title.startsWith("Categoria:!"),
  );
  const badges = page.categories
    .filter((category) => !category.title.startsWith("Categoria:!"))
    .slice(0, 3)
    .map((category) => category.title.replace(/^Categoria:/, ""));

  return {
    id: String(page.pageid),
    slug: toArticleKey(page.title),
    breadcrumb: [
      { label: "Wikipédia" },
      ...(topicCategory
        ? [{ label: topicCategory.title.replace(/^Categoria:/, "") }]
        : []),
      { label: page.title },
    ],
    title: page.title,
    origin: "Origem: Wikipédia, a enciclopédia livre.",
    sourceUrl: page.fullurl,
    revisionId: page.lastrevid ?? null,
    badges,
    meta: {
      languages: page.langlinkscount ?? languages.length,
      ...lastEditedOf(page),
      watchersLabel: "Acompanhar página",
    },
    infobox: mapInfobox(content, page.title),
    languages,
    introBlocks,
    sections,
  };
}
