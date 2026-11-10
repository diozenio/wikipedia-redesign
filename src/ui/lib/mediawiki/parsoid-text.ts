import type { MediaWikiImage, MediaWikiInline } from "@/ui/lib/mediawiki/types";

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

const IGNORED_TEXT_TAGS = new Set(["STYLE", "SCRIPT", "LINK", "META"]);
const IGNORED_TEXT_CLASSES = [
  "reference",
  "mw-ref",
  "mw-editsection",
  "mw-cite-backlink",
  "noprint",
];
const SPACED_TAGS = new Set(["BR", "LI", "P", "DIV", "DD", "DT", "TD", "TH"]);

export type NoteNumbers = Map<string, number>;

export function hasAnyClass(element: Element, classes: string[]) {
  return classes.some((name) => element.classList.contains(name));
}

export function childElements(element: Element, tagNames: string[]) {
  return Array.from(element.children).filter((child) =>
    tagNames.includes(child.tagName),
  );
}

function isNoteCall(element: Element) {
  return (
    element.tagName === "SUP" &&
    (element.classList.contains("reference") ||
      element.getAttribute("typeof") === "mw:Extension/ref")
  );
}

function isIgnoredForText(element: Element) {
  if (IGNORED_TEXT_TAGS.has(element.tagName)) return true;
  if (isNoteCall(element)) return true;
  return (
    element.tagName !== "TABLE" && hasAnyClass(element, IGNORED_TEXT_CLASSES)
  );
}

function decodeFragment(href: string) {
  const fragment = href.slice(href.indexOf("#") + 1);
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

function noteNumberOf(element: Element, notes: NoteNumbers) {
  const href = element.querySelector("a[href]")?.getAttribute("href");
  return href?.includes("#") ? notes.get(decodeFragment(href)) : undefined;
}

export function noteNumbersOf(document: Document): NoteNumbers {
  const notes: NoteNumbers = new Map();
  for (const item of document.querySelectorAll(
    "ol.references > li, ol.mw-references > li",
  )) {
    if (item.id && !notes.has(item.id)) notes.set(item.id, notes.size + 1);
  }
  return notes;
}

function createInlineBuilder() {
  const segments: MediaWikiInline[] = [];
  let text = "";
  let pendingSpace = false;

  return {
    pushText(raw: string) {
      const collapsed = raw.replace(/\s+/g, " ");
      const core = collapsed.trim();
      if (!core) {
        if (collapsed) pendingSpace = true;
        return;
      }
      const chunk =
        (pendingSpace || collapsed.startsWith(" ")) && text ? ` ${core}` : core;
      text += chunk;
      pendingSpace = collapsed.endsWith(" ");
      const last = segments[segments.length - 1];
      if (last?.type === "text") last.text += chunk;
      else segments.push({ type: "text", text: chunk });
    },
    pushNote(number: number) {
      segments.push({ type: "note", number });
    },
    result() {
      return { text, segments };
    },
  };
}

function walkInline(
  node: Node,
  builder: ReturnType<typeof createInlineBuilder>,
  notes: NoteNumbers | null,
) {
  if (node.nodeType === TEXT_NODE) {
    builder.pushText(node.textContent ?? "");
    return;
  }
  if (node.nodeType !== ELEMENT_NODE) return;

  const element = node as Element;
  if (notes && isNoteCall(element)) {
    const number = noteNumberOf(element, notes);
    if (number) builder.pushNote(number);
    return;
  }
  if (isIgnoredForText(element)) return;
  for (const child of element.childNodes) walkInline(child, builder, notes);
  if (SPACED_TAGS.has(element.tagName)) builder.pushText(" ");
}

export function segmentsOf(element: Element, notes: NoteNumbers) {
  const builder = createInlineBuilder();
  for (const child of element.childNodes) walkInline(child, builder, notes);
  return builder.result();
}

export function textOf(node: Node): string {
  const builder = createInlineBuilder();
  walkInline(node, builder, null);
  return builder.result().text;
}

function dimension(image: Element, rendered: string, original: string) {
  return Number(
    image.getAttribute(rendered) ?? image.getAttribute(original) ?? 0,
  );
}

export function toImage(
  container: Element,
  captionElement: Element | null,
): MediaWikiImage | null {
  const image = container.querySelector("img");
  if (!image) return null;

  const src = image.getAttribute("src") ?? "";

  return {
    src: src.startsWith("//") ? `https:${src}` : src,
    alt: (image.getAttribute("alt") ?? "").replace(/\s+/g, " ").trim(),
    caption: captionElement ? textOf(captionElement) : "",
    width: dimension(image, "width", "data-file-width"),
    height: dimension(image, "height", "data-file-height"),
  };
}
