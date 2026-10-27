import type {
  MediaWikiBlock,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

const IGNORED_TEXT_TAGS = new Set(["STYLE", "SCRIPT", "LINK", "META"]);
const IGNORED_TEXT_CLASSES = [
  "reference",
  "mw-ref",
  "mw-editsection",
  "noprint",
];
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
];

function hasAnyClass(element: Element, classes: string[]) {
  return classes.some((name) => element.classList.contains(name));
}

function isIgnoredForText(element: Element) {
  if (IGNORED_TEXT_TAGS.has(element.tagName)) return true;
  if (
    element.tagName === "SUP" &&
    (element.classList.contains("reference") ||
      element.getAttribute("typeof") === "mw:Extension/ref")
  ) {
    return true;
  }
  return (
    element.tagName !== "TABLE" && hasAnyClass(element, IGNORED_TEXT_CLASSES)
  );
}

function textOf(node: Node): string {
  const parts: string[] = [];

  const walk = (current: Node) => {
    if (current.nodeType === TEXT_NODE) {
      parts.push(current.textContent ?? "");
      return;
    }
    if (current.nodeType !== ELEMENT_NODE) return;
    if (isIgnoredForText(current as Element)) return;
    for (const child of current.childNodes) walk(child);
  };

  walk(node);
  return parts.join("").replace(/\s+/g, " ").trim();
}

function childElements(element: Element, tagNames: string[]) {
  return Array.from(element.children).filter((child) =>
    tagNames.includes(child.tagName),
  );
}

function toImageBlock(figure: Element): MediaWikiBlock | null {
  const image = figure.querySelector("img");
  if (!image) return null;

  const caption = figure.querySelector("figcaption");
  const src = image.getAttribute("src") ?? "";

  return {
    type: "image",
    src: src.startsWith("//") ? `https:${src}` : src,
    width: Number(
      image.getAttribute("data-file-width") ?? image.getAttribute("width") ?? 0,
    ),
    height: Number(
      image.getAttribute("data-file-height") ??
        image.getAttribute("height") ??
        0,
    ),
    caption: caption ? textOf(caption) : "",
  };
}

function blocksOf(section: Element): MediaWikiBlock[] {
  const blocks: MediaWikiBlock[] = [];

  const visit = (element: Element) => {
    if (IGNORED_BLOCK_TAGS.has(element.tagName)) return;
    if (
      hasAnyClass(element, IGNORED_BLOCK_CLASSES) ||
      element.getAttribute("role") === "navigation"
    ) {
      return;
    }

    switch (element.tagName) {
      case "P": {
        const text = textOf(element);
        if (text) blocks.push({ type: "p", text });
        return;
      }
      case "UL":
      case "OL": {
        const items = childElements(element, ["LI"])
          .map(textOf)
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
          .map((row) => childElements(row, ["TD", "TH"]).map(textOf))
          .filter((cells) => cells.length > 0);
        if (rows.length > 0) blocks.push({ type: "table", rows });
        return;
      }
      case "FIGURE": {
        const block = toImageBlock(element);
        if (block) blocks.push(block);
        return;
      }
      default:
        for (const child of element.children) visit(child);
    }
  };

  for (const child of section.children) visit(child);
  return blocks;
}

function headingOf(section: Element) {
  for (const child of section.children) {
    if (child.tagName === "H2" || child.tagName === "H3") {
      return { heading: textOf(child), level: child.tagName.toLowerCase() };
    }
    if (child.tagName === "DIV" && child.classList.contains("mw-heading")) {
      const [heading] = childElements(child, ["H2", "H3"]);
      return heading
        ? { heading: textOf(heading), level: heading.tagName.toLowerCase() }
        : { heading: null, level: null };
    }
  }
  return { heading: null, level: null };
}

export function parseParsoidSections(document: Document): MediaWikiSection[] {
  return Array.from(
    document.querySelectorAll("section[data-mw-section-id]"),
  ).map((section) => {
    const { heading, level } = headingOf(section);
    return {
      id: section.getAttribute("data-mw-section-id") ?? "",
      heading,
      level: level as MediaWikiSection["level"],
      blocks: blocksOf(section),
    };
  });
}
