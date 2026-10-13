export type MediaWikiBlock =
  | { type: "p"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | {
      type: "image";
      src: string;
      caption: string;
      width: number;
      height: number;
    };

export type MediaWikiSection = {
  id: string;
  heading: string | null;
  level: "h2" | "h3" | null;
  blocks: MediaWikiBlock[];
};

export type MediaWikiCategory = { ns: number; title: string };

export type MediaWikiPage = {
  pageid: number;
  title: string;
  fullurl: string;
  categories: MediaWikiCategory[];
  extract: string;
  languageCount: number;
};

export type MediaWikiPageResponse = {
  query: { pages: MediaWikiPage[] };
};
