import type { ArticleLanguage } from "@/ui/components/article/types";
import type { MediaWikiLangLink } from "@/ui/lib/mediawiki/types";

const BCP47_BY_WIKI_CODE: Record<string, string> = {
  simple: "en",
  "be-x-old": "be-tarask",
  "zh-classical": "lzh",
  "zh-yue": "yue",
  "zh-min-nan": "nan",
  "roa-rup": "rup",
  "roa-tara": "nap",
  "fiu-vro": "vro",
  "bat-smg": "sgs",
  "map-bms": "jv",
  "nds-nl": "nds-NL",
  "cbk-zam": "cbk",
  als: "gsw",
  no: "nb",
};

const PREFERRED_ORDER = ["en", "es", "fr", "de", "it", "ja", "zh", "ru"];

function rank(code: string) {
  const index = PREFERRED_ORDER.indexOf(code);
  return index === -1 ? PREFERRED_ORDER.length : index;
}

export function mapLanguages(links: MediaWikiLangLink[] = []) {
  return links
    .filter((link) => link.url)
    .map(
      (link): ArticleLanguage => ({
        code: BCP47_BY_WIKI_CODE[link.lang] ?? link.lang,
        name: link.langname ?? link.lang,
        autonym: link.autonym || link.langname || link.lang,
        url: link.url ?? "",
      }),
    )
    .sort((a, b) => rank(a.code) - rank(b.code));
}
