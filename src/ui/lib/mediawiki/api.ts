import type {
  MediaWikiFeaturedFeed,
  MediaWikiGeneratorResponse,
  MediaWikiPage,
  MediaWikiPageResponse,
} from "@/ui/lib/mediawiki/types";

const WIKI_ORIGIN = "https://pt.wikipedia.org";
const FEED_ORIGIN = "https://api.wikimedia.org/feed/v1/wikipedia/pt";

export type MediaWikiRequestOptions = {
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export class MediaWikiNotFoundError extends Error {
  constructor(resource: string) {
    super(`MediaWiki resource not found: ${resource}`);
    this.name = "MediaWikiNotFoundError";
  }
}

async function request(url: string, options: MediaWikiRequestOptions) {
  const response = await fetch(url, options);
  if (response.status === 404) throw new MediaWikiNotFoundError(url);
  if (!response.ok) {
    throw new Error(`MediaWiki request failed (${response.status}): ${url}`);
  }
  return response;
}

async function queryPage(
  selector: { titles: string } | { pageids: string },
  options: MediaWikiRequestOptions,
): Promise<MediaWikiPage> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    prop: "info|categories|extracts|langlinkscount",
    inprop: "url",
    explaintext: "1",
    cllimit: "max",
    ...selector,
  });
  const response = await request(`${WIKI_ORIGIN}/w/api.php?${params}`, options);
  const data = (await response.json()) as MediaWikiPageResponse;
  const page = data.query?.pages[0];

  if (!page || "missing" in page || "invalid" in page) {
    throw new MediaWikiNotFoundError(Object.values(selector)[0]);
  }
  return page;
}

export function fetchMediaWikiPage(
  title: string,
  options: MediaWikiRequestOptions = {},
) {
  return queryPage({ titles: title }, options);
}

export function fetchMediaWikiPageById(
  pageId: string,
  options: MediaWikiRequestOptions = {},
) {
  return queryPage({ pageids: pageId }, options);
}

export async function fetchMediaWikiHtml(
  title: string,
  options: MediaWikiRequestOptions = {},
): Promise<string> {
  const response = await request(
    `${WIKI_ORIGIN}/api/rest_v1/page/html/${encodeURIComponent(title)}`,
    options,
  );
  return response.text();
}

export async function fetchMediaWikiFeaturedFeed(
  date: string,
  options: MediaWikiRequestOptions = {},
): Promise<MediaWikiFeaturedFeed> {
  const response = await request(
    `${FEED_ORIGIN}/featured/${date.replaceAll("-", "/")}`,
    options,
  );
  return (await response.json()) as MediaWikiFeaturedFeed;
}

async function queryGenerator(
  params: Record<string, string>,
  options: MediaWikiRequestOptions,
): Promise<MediaWikiGeneratorResponse> {
  const search = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    ...params,
  });
  const response = await request(`${WIKI_ORIGIN}/w/api.php?${search}`, options);
  return (await response.json()) as MediaWikiGeneratorResponse;
}

export function searchMediaWikiArticles(
  query: string,
  options: MediaWikiRequestOptions = {},
) {
  return queryGenerator(
    {
      generator: "prefixsearch",
      gpssearch: query,
      gpsnamespace: "0",
      gpslimit: "6",
      redirects: "1",
      prop: "pageimages|description",
      piprop: "thumbnail",
      pithumbsize: "80",
    },
    options,
  );
}

export function fetchMediaWikiRelatedArticles(
  title: string,
  options: MediaWikiRequestOptions = {},
) {
  return queryGenerator(
    {
      generator: "search",
      gsrsearch: `morelike:${title}`,
      gsrnamespace: "0",
      gsrlimit: "6",
      prop: "pageimages|description|extracts",
      piprop: "thumbnail",
      pithumbsize: "320",
      exintro: "1",
      explaintext: "1",
      exsentences: "2",
    },
    options,
  );
}
