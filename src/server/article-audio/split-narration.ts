const MAX_CHUNK_LENGTH = 800;

function splitSentences(paragraph: string): string[] {
  return paragraph.match(/[^.!?]+[.!?]*\s*/g) ?? [paragraph];
}

function splitLongParagraph(paragraph: string): string[] {
  if (paragraph.length <= MAX_CHUNK_LENGTH) return [paragraph];
  return splitSentences(paragraph);
}

function fitsInChunk(chunk: string, piece: string): boolean {
  return chunk.length + piece.length + 1 <= MAX_CHUNK_LENGTH;
}

function groupPieces(pieces: string[]): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const piece of pieces) {
    if (current && !fitsInChunk(current, piece)) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current}\n${piece}` : piece;
  }

  if (current) chunks.push(current);
  return chunks;
}

export function splitNarration(narration: string): string[] {
  const paragraphs = narration.split(/\n{2,}/);
  return groupPieces(paragraphs.flatMap(splitLongParagraph));
}
