export type RichTextInline =
  | { type: "text"; text: string }
  | { type: "note"; number: number; id: string; targetId: string };

export type RichTextReference = {
  number: number;
  id: string;
  text: string;
  backlinkId: string | null;
};

export type RichTextBlock =
  | { type: "paragraph"; text: string; segments?: RichTextInline[] }
  | { type: "heading"; id: string; text: string; level?: 3 | 4 }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    }
  | { type: "references"; items: RichTextReference[] };
