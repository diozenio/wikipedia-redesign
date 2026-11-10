export type MediaWikiInline =
  | { type: "text"; text: string }
  | { type: "note"; number: number };

export type MediaWikiImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type MediaWikiInfobox = {
  caption: string | null;
  image: MediaWikiImage | null;
  rows: { label: string; value: string }[];
};

export type MediaWikiBlock =
  | { type: "p"; text: string; segments?: MediaWikiInline[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | ({ type: "image" } & MediaWikiImage)
  | ({ type: "infobox" } & MediaWikiInfobox)
  | { type: "references"; items: { number: number; text: string }[] };

export type MediaWikiSection = {
  id: string;
  heading: string | null;
  level: "h2" | "h3" | "h4" | null;
  blocks: MediaWikiBlock[];
};

export type MediaWikiCategory = { ns: number; title: string };

export type MediaWikiPage = {
  pageid: number;
  title: string;
  fullurl: string;
  categories: MediaWikiCategory[];
  extract: string;
  touched?: string;
  lastrevid?: number;
  langlinkscount?: number;
  langlinks?: MediaWikiLangLink[];
  revisions?: { timestamp: string }[];
};

export type MediaWikiLangLink = {
  lang: string;
  title: string;
  url?: string;
  langname?: string;
  autonym?: string;
};

export type MediaWikiPageResponse = {
  query: { pages: MediaWikiPage[] };
};

export type MediaWikiFeedThumbnail = {
  source: string;
  width: number;
  height: number;
};

export type MediaWikiFeedArticle = {
  type: string;
  pageid: number;
  title: string;
  titles: { canonical: string; normalized: string };
  description?: string;
  extract: string;
  thumbnail?: MediaWikiFeedThumbnail;
  views?: number;
  rank?: number;
};

export type MediaWikiFeaturedFeed = {
  tfa?: MediaWikiFeedArticle;
  mostread?: { date: string; articles: MediaWikiFeedArticle[] };
};

export type MediaWikiGeneratorPage = {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  description?: string;
  extract?: string;
  thumbnail?: MediaWikiFeedThumbnail;
};

export type MediaWikiGeneratorResponse = {
  query?: { pages: Record<string, MediaWikiGeneratorPage> };
};
