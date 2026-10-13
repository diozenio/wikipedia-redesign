export type RichTextBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | {
      type: "image";
      src: string;
      caption: string;
      width: number;
      height: number;
    };
