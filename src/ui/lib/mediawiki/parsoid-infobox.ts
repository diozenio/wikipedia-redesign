import {
  childElements,
  textOf,
  toImage,
} from "@/ui/lib/mediawiki/parsoid-text";
import type { MediaWikiInfobox } from "@/ui/lib/mediawiki/types";

const MIN_IMAGE_WIDTH = 100;
const CELL_TAGS = ["TH", "TD"];

function rowsOf(table: Element) {
  return Array.from(table.querySelectorAll("tr")).filter(
    (row) => row.closest("table") === table,
  );
}

function captionOf(table: Element, rows: Element[]) {
  const explicit = table.querySelector("caption, .infobox-above, .cabecalho");
  if (explicit) return textOf(explicit) || null;

  const titleRow = rows.find((row) => {
    const cells = childElements(row, CELL_TAGS);
    return cells.length === 1 && cells[0].tagName === "TH";
  });
  return titleRow ? textOf(titleRow) || null : null;
}

function imageCellOf(table: Element) {
  const explicit = table.querySelector(".infobox-image");
  if (explicit?.querySelector("img")) return explicit;

  const image = Array.from(table.querySelectorAll("img")).find(
    (candidate) =>
      Number(candidate.getAttribute("width") ?? 0) >= MIN_IMAGE_WIDTH,
  );
  return image?.closest("td, th") ?? null;
}

function imageOf(cell: Element | null) {
  if (!cell) return null;
  return toImage(cell, cell.querySelector(".infobox-caption") ?? cell);
}

function cellValue(cell: Element) {
  const items = Array.from(cell.querySelectorAll("li"))
    .filter((item) => item.parentElement?.closest("li, td, th") === cell)
    .map((item) => textOf(item))
    .filter(Boolean);
  return items.length > 1 ? items.join(", ") : textOf(cell);
}

export function toInfobox(table: Element): MediaWikiInfobox {
  const rows = rowsOf(table);
  const imageCell = imageCellOf(table);

  return {
    caption: captionOf(table, rows),
    image: imageOf(imageCell),
    rows: rows.flatMap((row) => {
      const cells = childElements(row, CELL_TAGS);
      if (cells.length !== 2 || (imageCell && cells.includes(imageCell)))
        return [];
      const label = textOf(cells[0]);
      const value = cellValue(cells[1]);
      return label && value ? [{ label, value }] : [];
    }),
  };
}
