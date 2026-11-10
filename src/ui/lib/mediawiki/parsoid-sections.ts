import { toInfobox } from "@/ui/lib/mediawiki/parsoid-infobox";
import {
  childElements,
  hasAnyClass,
  type NoteNumbers,
  noteNumbersOf,
  segmentsOf,
  textOf,
  toImage,
} from "@/ui/lib/mediawiki/parsoid-text";
import type {
  MediaWikiBlock,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";

const IGNORED_BLOCK_TAGS = new Set([
  "SECTION",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "STYLE",
  "LINK",
  "META",
]);
const IGNORED_BLOCK_CLASSES = [
  "references",
  "mw-references",
  "navbox",
  "navbox-inner",
  "ambox",
  "metadata",
];
const HEADING_TAGS = ["H2", "H3", "H4"];

function isReferenceList(element: Element) {
  return (
    element.tagName === "OL" &&
    hasAnyClass(element, ["references", "mw-references"])
  );
}

function isInfobox(element: Element) {
  return (
    element.tagName === "TABLE" &&
    element.classList.contains("infobox") &&
    !element.classList.contains("noprint")
  );
}

function referencesOf(list: Element, notes: NoteNumbers): MediaWikiBlock {
  const items = childElements(list, ["LI"]).flatMap((item) => {
    const number = notes.get(item.id);
    const body = item.querySelector(".mw-reference-text") ?? item;
    const text = textOf(body);
    return number && text ? [{ number, text }] : [];
  });
  return { type: "references", items };
}

function galleryOf(list: Element): MediaWikiBlock[] {
  return Array.from(list.querySelectorAll("li")).flatMap((item) => {
    const image = toImage(item, item.querySelector(".gallerytext"));
    return image ? [{ type: "image" as const, ...image }] : [];
  });
}

function blocksOf(section: Element, notes: NoteNumbers): MediaWikiBlock[] {
  const blocks: MediaWikiBlock[] = [];

  const visit = (element: Element) => {
    if (IGNORED_BLOCK_TAGS.has(element.tagName)) return;
    if (isReferenceList(element)) {
      blocks.push(referencesOf(element, notes));
      return;
    }
    if (isInfobox(element)) {
      blocks.push({ type: "infobox", ...toInfobox(element) });
      return;
    }
    if (
      hasAnyClass(element, IGNORED_BLOCK_CLASSES) ||
      element.getAttribute("role") === "navigation"
    ) {
      return;
    }

    switch (element.tagName) {
      case "P": {
        const { text, segments } = segmentsOf(element, notes);
        if (!text) return;
        blocks.push(
          segments.some((segment) => segment.type === "note")
            ? { type: "p", text, segments }
            : { type: "p", text },
        );
        return;
      }
      case "UL":
      case "OL": {
        if (element.classList.contains("gallery")) {
          blocks.push(...galleryOf(element));
          return;
        }
        const items = childElements(element, ["LI"])
          .map((item) => textOf(item))
          .filter(Boolean);
        if (items.length > 0) {
          blocks.push({
            type: "list",
            ordered: element.tagName === "OL",
            items,
          });
        }
        return;
      }
      case "TABLE": {
        const rows = Array.from(element.querySelectorAll("tr"))
          .map((row) =>
            childElements(row, ["TD", "TH"]).map((cell) => textOf(cell)),
          )
          .filter((cells) => cells.length > 0);
        if (rows.length > 0) blocks.push({ type: "table", rows });
        return;
      }
      case "FIGURE": {
        const image = toImage(element, element.querySelector("figcaption"));
        if (image) blocks.push({ type: "image", ...image });
        return;
      }
      default:
        for (const child of element.children) visit(child);
    }
  };

  for (const child of section.children) visit(child);
  return blocks;
}

function headingFrom(element: Element) {
  return {
    heading: textOf(element),
    level: element.tagName.toLowerCase() as MediaWikiSection["level"],
  };
}

function headingOf(section: Element) {
  for (const child of section.children) {
    if (HEADING_TAGS.includes(child.tagName)) return headingFrom(child);
    if (child.tagName === "DIV" && child.classList.contains("mw-heading")) {
      const [heading] = childElements(child, HEADING_TAGS);
      return heading ? headingFrom(heading) : { heading: null, level: null };
    }
  }
  return { heading: null, level: null };
}

export function parseParsoidSections(document: Document): MediaWikiSection[] {
  const notes = noteNumbersOf(document);

  return Array.from(
    document.querySelectorAll("section[data-mw-section-id]"),
  ).map((section) => {
    const { heading, level } = headingOf(section);
    return {
      id: section.getAttribute("data-mw-section-id") ?? "",
      heading,
      level,
      blocks: blocksOf(section, notes),
    };
  });
}
