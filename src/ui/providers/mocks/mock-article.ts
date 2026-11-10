import type { ArticleData } from "@/ui/components/article/types";
import { mapMediaWikiArticleToDomain } from "@/ui/lib/mediawiki/article-mapper";
import type {
  MediaWikiPageResponse,
  MediaWikiSection,
} from "@/ui/lib/mediawiki/types";
import saoSilvestreContent from "@/ui/providers/mocks/mediawiki/corrida-internacional-de-sao-silvestre.content.json";
import saoSilvestrePage from "@/ui/providers/mocks/mediawiki/corrida-internacional-de-sao-silvestre.page.json";
import jogoDoBichoContent from "@/ui/providers/mocks/mediawiki/jogo-do-bicho.content.json";
import jogoDoBichoPage from "@/ui/providers/mocks/mediawiki/jogo-do-bicho.page.json";
import malhacao2017Content from "@/ui/providers/mocks/mediawiki/malhacao-2017.content.json";
import malhacao2017Page from "@/ui/providers/mocks/mediawiki/malhacao-2017.page.json";
import megaSenaContent from "@/ui/providers/mocks/mediawiki/mega-sena.content.json";
import megaSenaPage from "@/ui/providers/mocks/mediawiki/mega-sena.page.json";
import oscarMaroniContent from "@/ui/providers/mocks/mediawiki/oscar-maroni.content.json";
import oscarMaroniPage from "@/ui/providers/mocks/mediawiki/oscar-maroni.page.json";
import shawnMendesContent from "@/ui/providers/mocks/mediawiki/shawn-mendes.content.json";
import shawnMendesPage from "@/ui/providers/mocks/mediawiki/shawn-mendes.page.json";
import sistemaDeInformacaoContent from "@/ui/providers/mocks/mediawiki/sistema-de-informacao.content.json";
import sistemaDeInformacaoPage from "@/ui/providers/mocks/mediawiki/sistema-de-informacao.page.json";
import vesperaDeAnoNovoContent from "@/ui/providers/mocks/mediawiki/vespera-de-ano-novo.content.json";
import vesperaDeAnoNovoPage from "@/ui/providers/mocks/mediawiki/vespera-de-ano-novo.page.json";

function mapMockArticle(page: unknown, content: unknown): ArticleData {
  return mapMediaWikiArticleToDomain(
    (page as MediaWikiPageResponse).query.pages[0],
    content as MediaWikiSection[],
  );
}

export const mockArticle: ArticleData = mapMockArticle(
  sistemaDeInformacaoPage,
  sistemaDeInformacaoContent,
);

export const mockArticles: ArticleData[] = [
  mockArticle,
  mapMockArticle(malhacao2017Page, malhacao2017Content),
  mapMockArticle(vesperaDeAnoNovoPage, vesperaDeAnoNovoContent),
  mapMockArticle(oscarMaroniPage, oscarMaroniContent),
  mapMockArticle(saoSilvestrePage, saoSilvestreContent),
  mapMockArticle(shawnMendesPage, shawnMendesContent),
  mapMockArticle(megaSenaPage, megaSenaContent),
  mapMockArticle(jogoDoBichoPage, jogoDoBichoContent),
];

export function findMockArticleBySlug(slug: string) {
  return mockArticles.find((article) => article.slug === slug) ?? null;
}

export function findMockArticleById(id: string) {
  return mockArticles.find((article) => article.id === id) ?? null;
}
