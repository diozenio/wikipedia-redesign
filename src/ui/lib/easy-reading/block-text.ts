function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join("");
  if (typeof value !== "object" || value === null) return "";

  const record = value as Record<string, unknown>;
  if (typeof record.text === "string") return record.text;
  return textOf(record.segments ?? record.children ?? record.content);
}

export function paragraphsToPlainText(blocks: readonly unknown[]): string {
  return blocks
    .filter(
      (block) =>
        typeof block === "object" &&
        block !== null &&
        (block as { type?: unknown }).type === "paragraph",
    )
    .map((block) => textOf(block).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}
