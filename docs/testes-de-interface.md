# Testes de interface

Este documento explica como a interface é testada e lista, em português
simples, **tudo** o que cada teste verifica. Ele é gerado a partir das próprias
histórias do Storybook: o texto de cada cenário é o comentário da história e
cada item da lista é um passo (`step`) do teste.

## Como funciona

- Cada componente tem um arquivo `*.stories.tsx` ao lado dele. Cada história
  (story) mostra o componente num estado e, quase sempre, tem uma função
  `play` que **age como um usuário**: clica, digita, aperta teclas e confere o
  resultado.
- Os passos são escritos como frases: “Quando o usuário …, então …”. No
  painel **Interactions** do Storybook dá para ver cada passo sendo executado.
- As buscas usam **papéis e nomes acessíveis** (`getByRole("button", { name: "Aumentar texto" })`).
  Se um teste encontra o elemento assim, isso já prova que um leitor de tela
  também encontra. `data-testid` só é usado quando não existe outra forma
  (apenas nos ícones da história `Motion/AnimatedIcon`, que são decorativos).
- Depois de cada história, o **axe** (addon de acessibilidade) analisa a tela.
  Qualquer violação (contraste, nome faltando, landmark repetido…) **reprova**
  o teste (`a11y.test: "error"` em `.storybook/preview.tsx`).
- Histórias que mexem nas preferências de acessibilidade apagam o que ficou salvo
  no navegador antes e depois de rodar (`resetAppearance` e
  `withStoredAppearance` em `src/ui/testing/story-helpers.ts`), para que uma
  não influencie a outra.
- APIs do navegador que não podem rodar num teste (área de transferência,
  impressão) são substituídas por versões falsas na própria história
  (`spyOn`), como em `ToolsCard`.

## Como rodar

- **No Storybook** (`pnpm ui:docs`, porta 6006): abra uma história e veja o
  painel **Interactions** (passo a passo) e **Accessibility** (resultado do
  axe). O botão **Run tests** / painel **Testing** na barra lateral roda todos
  os testes de uma vez.
- **No terminal**: `pnpm test` (atalho para
  `vitest --project=storybook --run`). Roda todas as histórias num Chromium
  sem janela, com as funções `play` e a verificação do axe. Para rodar só uma
  pasta: `pnpm test src/ui/components/header`.

## Arquitetura: contexts e providers

A interface nunca busca dados nem chama serviços externos diretamente. Todo
componente lê o que precisa de um **context** (em `src/ui/contexts/`), e quem
preenche esse context é um **provider**:

| Context | Provider real | Provider simulado (Storybook / modo mock) |
| --- | --- | --- |
| `ArticleContext` | `MediaWikiArticleProvider` | `MockArticleProvider` |
| `SearchContext` | `MediaWikiSearchProvider` | `MockSearchProvider` |
| `SeeAlsoContext` | `MediaWikiSeeAlsoProvider` | `MockSeeAlsoProvider` |
| `FeaturedArticlesContext` | `MediaWikiFeaturedArticlesProvider` | `MockFeaturedArticlesProvider` |
| `ArticleAudioContext` | `ArticleAudioProvider` (rota `/api/articles/:id/audio`) | `MockArticleAudioProvider` |
| `ArticleSummaryContext` | `ApiArticleSummaryProvider` (rota `/api/articles/:id/summary`) | `MockArticleSummaryProvider` |
| `AppearanceContext` | `AppearanceProvider` (salva no `localStorage`) | o mesmo |
| `EmptyStateContext` | `NotFoundProvider`, `ArticleNotFoundProvider`, `ArticleErrorProvider` | valores passados direto na história |

- As páginas (`src/app/**`) escolhem o provider em
  `src/ui/providers/data-providers.ts`: com `NEXT_PUBLIC_USE_MOCKS=true` usam os
  simulados, senão os reais.
- O Storybook usa sempre os simulados (decorator global em
  `.storybook/preview.tsx`). Uma história pode trocar o estado colocando outro
  provider ou o próprio context em volta do componente — por exemplo,
  `SeeAlsoContext value={{ status: "loading" }}` para testar o carregamento, ou
  `MockArticleAudioProvider outcome="error"` para simular falha no áudio.
- Assim, o mesmo componente funciona igual com dados reais, simulados ou
  fixos, e nenhum teste depende de rede, IA ou banco de dados.

## Preferência “Números de notas de rodapé”

No painel **Acessibilidade** há o interruptor “Números de notas de rodapé”
(ligado por padrão). Desligado, os números `[1]`, `[2]`… somem do meio do
texto (não são nem renderizados, então leitores de tela também os pulam). A
seção “Notas e referências” continua no fim do artigo, mas sem os links
“Voltar ao texto”, já que não há mais um número para onde voltar. A escolha
fica salva (`footnoteMarkers` no `localStorage`) e é aplicada antes da
primeira pintura como `data-footnotes="true|false"` no `<html>`.

## Imagens que não carregam

Vale para as imagens do artigo (`RichTextImage`) e para a foto de capa da
barra lateral (`SummaryCard`), que usam o mesmo componente
`src/ui/components/image/image-with-fallback.tsx`. Se uma imagem falhar (inclusive antes de a página ficar interativa),
no lugar do ícone de imagem quebrada do navegador aparece um quadro com o
ícone e o texto “Imagem indisponível”. Ele continua descrevendo a imagem para
leitores de tela (`role="img"`, nome “Imagem indisponível: {texto
alternativo}”), não pode ser ampliado e a legenda continua embaixo — sem
legenda vazia quando a imagem não tem uma.

## Lista de testes por componente

As histórias sem passos (marcadas abaixo) ainda são testadas: o Storybook
confere que renderizam sem erro e o axe confere a acessibilidade.

## Components


### Appearance/AppearancePanel

Arquivo: `src/ui/components/appearance/appearance-panel.stories.tsx`


**Default** — O painel abre com os valores padrão: tema claro, texto em 100%, espaçamento padrão, fonte para dislexia e leitura facilitada desligadas e os números das notas de rodapé ligados. Todos os controles têm nome acessível.

- Então os três temas aparecem e o claro está marcado
- Então o tamanho do texto mostra 100% (Padrão)
- Então o espaçamento padrão está marcado
- Então os interruptores mostram o estado padrão
- Então cada interruptor tem uma descrição que explica o que ele faz

**ChangeTheme** — Quando a pessoa escolhe o tema escuro, a página inteira muda na hora (atributo `data-theme` do `<html>`) e a escolha fica salva no navegador.

- Quando o usuário escolhe o tema Escuro, então a página fica escura
- Então a escolha fica salva no navegador
- Quando o usuário escolhe Alto contraste, então o tema muda de novo

**ChangeFontSize** — Os botões "Aumentar texto" e "Diminuir texto" percorrem os tamanhos disponíveis (87,5% a 200%) e ficam desativados ao chegar no limite.

- Quando o usuário clica em Aumentar texto, então o texto vai para 112,5%
- Quando o usuário aumenta até o máximo, então o botão Aumentar fica desativado
- Quando o usuário diminui até o mínimo, então o botão Diminuir fica desativado
- Quando o usuário clica no botão desativado, então nada muda

**ChangeSpacing** — As opções de espaçamento mudam o atributo `data-spacing` da página.

- Quando o usuário escolhe Amplo, então o espaçamento fica amplo
- Quando o usuário escolhe Extra amplo, então o espaçamento fica extra amplo e é salvo

**ToggleSwitches** — Os três interruptores (fonte para dislexia, leitura facilitada e números de notas de rodapé) ligam e desligam com clique e com o teclado.

- Quando o usuário liga a fonte para dislexia, então a página passa a usar a OpenDyslexic
- Quando o usuário desliga a fonte para dislexia, então o atributo some
- Quando o usuário liga a leitura facilitada pelo teclado (Espaço), então ela fica ativa
- Quando o usuário desliga os números de notas, então a página marca data-footnotes=false e salva

**ResetToDefaults** — "Restaurar padrão" desfaz todas as mudanças e apaga as preferências salvas no navegador.

- Dado que o usuário mudou tema, tamanho e notas
- Quando o usuário clica em Restaurar padrão, então tudo volta ao padrão
- Então as preferências salvas são apagadas

### Appearance/AppearanceScript

Arquivo: `src/ui/components/appearance/appearance-script.stories.tsx`


**Defaults** — Sem nada salvo, o script aplica os valores padrão (notas de rodapé ligadas).

- Quando não há preferências salvas, então os atributos padrão são aplicados

**StoredPreferences** — Com preferências salvas, o script aplica cada uma delas.

- Quando há preferências salvas, então o html já nasce com elas

**InvalidValues** — Valores inválidos ou dados corrompidos são ignorados, sem quebrar a página.

- Quando os valores salvos são inválidos, então os padrões são usados
- Quando o JSON salvo está corrompido, então o script não falha

### Article/ArticleBreadcrumb

Arquivo: `src/ui/components/article/article-breadcrumb.stories.tsx`


**Default** — A trilha de navegação é uma região `navigation` chamada "Trilha de navegação", com os itens em uma lista ordenada. O último item é a página atual (`aria-current="page"`).

- Então a trilha lista todos os níveis em ordem
- Então só o último item é marcado como página atual

### Article/ArticleColumn

Arquivo: `src/ui/components/article/article-column.stories.tsx`


**Default** — O artigo completo: trilha de navegação, título, introdução, uma seção para cada parte do texto, imagens com texto alternativo e legenda e a lista de notas e referências com links de ida e volta.

- Então o artigo é nomeado pelo seu título (h1)
- Então a trilha de navegação vem antes do conteúdo
- Então cada seção aparece com seu título de nível 2
- Então toda imagem tem texto alternativo e legenda
- Então cada número de nota leva a uma nota que existe na lista de referências
- Então as notas têm o link Voltar ao texto apontando para o número no texto

**WithoutFootnoteMarkers** — Com os números de notas desligados, o texto fica sem os números, mas a lista de notas e referências continua no fim. Os links "Voltar ao texto" somem, porque não há mais para onde voltar.

- Então não há números de nota no texto
- Então a lista de notas continua, mas sem Voltar ao texto

**EasyReading** — Com a leitura facilitada, o resumo simplificado aparece logo antes da introdução.

- Então o cartão de resumo aparece com o resumo do provedor simulado

### Article/ArticleHeader

Arquivo: `src/ui/components/article/article-header.stories.tsx`


**Default** — O cabeçalho do artigo tem um único título de nível 1, a origem, os selos e as informações (idiomas, última edição e quem acompanha) em listas nomeadas.

- Então o título do artigo é o único h1
- Então os selos aparecem numa lista chamada Selos do artigo
- Então as informações mostram a quantidade de idiomas

### Article/ArticleIntro

Arquivo: `src/ui/components/article/article-intro.stories.tsx`


**Default** — A introdução mostra os parágrafos com os números das notas de rodapé no meio do texto. Cada número é um link chamado "Nota N" que leva para a nota correspondente no fim do artigo (`#nota-N`).

- Então cada parágrafo da introdução aparece
- Então os números das notas são links para as notas no fim do artigo

**WithFootnotes** — Outro artigo (Shawn Mendes), para conferir notas vindas de outra fonte.

- Então há pelo menos um link de nota

**EasyReading** — Com a leitura facilitada ligada, cada parágrafo longo é dividido em blocos de no máximo duas frases, então aparecem mais parágrafos do que no texto original — sem perder as notas.

- Então os parágrafos são divididos em blocos menores
- Então as notas continuam no texto

**WithoutFootnoteMarkers** — Com a opção "Números de notas de rodapé" desligada, os números somem do meio do texto (inclusive para leitores de tela). O texto continua igual.

- Então nenhum número de nota aparece no texto
- Então os parágrafos continuam todos lá

### Article/ArticleReadButton

Arquivo: `src/ui/components/article/article-read-button.stories.tsx`


**Idle** — Estado inicial: o botão mostra "Ler", mas o nome acessível completo é "Ler o artigo em voz alta". Clicar chama a ação de gerar o áudio.

- Quando o usuário clica em Ler, então a geração do áudio é pedida

**Requesting** — Enquanto o pedido é enviado, o botão fica ocupado (`aria-disabled`) e ignora novos cliques.

- Quando o usuário clica durante o preparo, então nada acontece

**Generating** — Durante a geração, o botão mostra o progresso em porcentagem.

- Então o botão mostra 42% e fica ocupado

**Failed** — Se a geração falhar, o botão vira "Tentar de novo" e volta a ser clicável.

- Quando o usuário clica em Tentar de novo, então a geração é pedida outra vez

**Connected** — Botão ligado ao contexto de áudio (com o provedor simulado, sem chamar a API). Ao clicar, ele passa por "Preparando…" e "Gerando áudio", anuncia cada fase para leitores de tela e some quando o player abre.

- Quando o usuário clica em Ler, então o aviso diz que o áudio está sendo preparado
- Então, quando o áudio fica pronto, o botão sai de cena para dar lugar ao player

**ConnectedFailure** — Com o provedor simulado configurado para falhar, o botão termina em "Tentar de novo".

- Quando a geração falha, então o botão oferece tentar de novo e o erro é anunciado

### Article/ArticleSection

Arquivo: `src/ui/components/article/article-section.stories.tsx`


**Default** — Cada seção é uma região nomeada pelo seu título (h2) e tem um `id` que o sumário usa como âncora.

- Então a seção é uma região com o nome do título

### Article/ArticleToolbar

Arquivo: `src/ui/components/article/article-toolbar.stories.tsx`


**Default** — A barra do artigo alterna entre Artigo e Discussão (botões com `aria-pressed`) e oferece ler em voz alta, ver histórico, favoritar e mais opções — todos com nome acessível.

- Então a aba Artigo está pressionada e Discussão não
- Então as ações têm nomes que dizem o que fazem

### Article/EasyReadingSummaryCard

Arquivo: `src/ui/components/article/easy-reading-summary.stories.tsx`


**Ready** — Resumo pronto: título "Resumo simplificado", o texto e o aviso de que foi gerado por IA.

- Então o cartão é uma região complementar com o título Resumo simplificado
- Então o resumo e o aviso de IA aparecem

**Loading** — Enquanto o resumo é gerado, o cartão fica `aria-busy` e avisa “Gerando resumo…”.

- Então o cartão está ocupado e avisa que o resumo está sendo gerado

**NotConfigured** — Sem chave de IA configurada, o cartão mostra o começo da introdução como alternativa e explica por que não há resumo.

- Então o título vira Introdução do artigo e mostra as duas primeiras frases

**Failed** — Se a IA falhar, o cartão também cai para a introdução e diz que não deu para gerar agora.

- Então aparece a introdução e a mensagem de erro

**ConnectedToProvider** — Componente completo: só aparece com a leitura facilitada ligada e pede o resumo pelo contexto (aqui, o provedor simulado — nenhuma IA é chamada).

- Quando o resumo chega do provedor, então ele aparece no cartão

**HiddenWhenEasyReadingIsOff** — Com a leitura facilitada desligada, o resumo não é exibido nem pedido.

- Então nada é exibido

### ArticleSidebar/ArticleSidebar

Arquivo: `src/ui/components/article-sidebar/article-sidebar.stories.tsx`


**Default** — A barra lateral é um landmark complementar ("Sobre o artigo") que junta os cartões de ferramentas, idiomas e ver também.

- Então a barra lateral é a região complementar Sobre o artigo
- Então os cartões aparecem como regiões nomeadas

**WithInfobox** — Num artigo com infobox, o cartão de resumo rápido aparece primeiro.

- Então o primeiro cartão é o resumo rápido

### ArticleSidebar/LanguagesCard

Arquivo: `src/ui/components/article-sidebar/languages-card.stories.tsx`


**Default** — Mostra os primeiros idiomas em destaque e um "Ver todos os N idiomas" que expande a lista completa. Cada link é escrito no próprio idioma e tem `lang`/`hreflang`, para o leitor de tela pronunciar certo.

- Então o título diz quantos idiomas existem
- Então cada link de idioma informa o idioma em lang e hreflang
- Quando o usuário abre Ver todos, então a lista completa aparece
- Quando o usuário clica de novo, então a lista recolhe

**WithoutTranslations** — Artigo sem traduções: o cartão avisa que não há outros idiomas.

- Então aparece a mensagem de que não há outros idiomas

### ArticleSidebar/SeeAlsoCard

Arquivo: `src/ui/components/article-sidebar/see-also-card.stories.tsx`


**Default** — "Ver também" lista artigos relacionados (vindos do contexto de artigos relacionados). Cada item é um link para a página do artigo.

- Então o cartão Ver também lista links para artigos

**Loading** — Enquanto carrega, o cartão fica `aria-busy` e avisa leitores de tela.

- Então aparece o aviso de carregamento

**Empty** — Sem artigos relacionados, aparece uma mensagem em vez da lista.

- Então aparece Nenhum artigo relacionado encontrado

**Failed** — Se a busca de relacionados falhar, o cartão explica o problema.

- Então aparece a mensagem de erro

### ArticleSidebar/SidebarCard

Arquivo: `src/ui/components/article-sidebar/sidebar-card.stories.tsx`


**Default** — Base de todos os cartões da barra lateral: uma `section` nomeada pelo próprio título (h2), para aparecer na lista de regiões do leitor de tela.

- Então o cartão é uma região nomeada pelo título h2

### ArticleSidebar/SummaryCard

Arquivo: `src/ui/components/article-sidebar/summary-card.stories.tsx`


**Default** — O resumo rápido (infobox) do artigo: uma região com título, a foto com texto alternativo e legenda, e os dados numa lista de definições (`dl` com `dt` para o rótulo e `dd` para o valor).

- Então o cartão é uma região com o título do infobox
- Então a foto tem texto alternativo e legenda
- Então cada dado aparece como termo e definição

**SportsEventInfobox** — Infobox de outro tipo de artigo (evento esportivo).

- Então os dados aparecem numa lista de definições

**WithoutInfobox** — Artigos sem infobox não mostram o cartão.

- Então nada é exibido

**BrokenImage** — Se a foto da capa não carregar, aparece o mesmo quadro “Imagem indisponível” das imagens do artigo, com a descrição acessível, e a legenda e os dados continuam no cartão.

- Quando a foto não carrega, então aparece Imagem indisponível com a descrição
- Então a legenda e os dados continuam no cartão

### ArticleSidebar/ToolsCard

Arquivo: `src/ui/components/article-sidebar/tools-card.stories.tsx`


**Default** — Ferramentas do artigo: citar, baixar PDF, imprimir, link permanente e item no Wikidata. Ações que fazem algo na página são botões; as que levam a outro endereço são links.

- Então as ações aparecem com o tipo certo de elemento

**CopyCitation** — "Citar esta página" copia uma citação pronta e mostra o aviso “Citação copiada.”.

- Quando o usuário clica em Citar esta página, então a citação vai para a área de transferência
- Então aparece o aviso Citação copiada.

**CopyPermalink** — "Link permanente" copia o endereço desta versão do artigo.

- Quando o usuário clica em Link permanente, então o link é copiado e um aviso aparece

**CopyFails** — Se o navegador bloquear a cópia, aparece um aviso de erro.

- Quando a cópia falha, então o usuário é avisado

**Print** — "Versão para impressão" abre a impressão do navegador.

- Quando o usuário clica em Versão para impressão, então a impressão é chamada

### AudioPlayer/ArticleAudioPlayer

Arquivo: `src/ui/components/audio-player/article-audio-player.stories.tsx`


**Active** — O player só aparece quando o áudio está ativo. Aqui o provedor simulado já começa nessa fase: o player mostra o título do artigo e anuncia o estado ("Reproduzindo", "Pausado"…).

- Então o player mostra o artigo que está tocando
- Quando o usuário clica em Pausar, então o estado anunciado vira Pausado
- Quando o usuário clica em Avançar, então o tempo anda 10 segundos
- Quando o usuário clica em Fechar, então o player some

**FromReadButton** — Fluxo completo com o botão Ler: o botão pede o áudio, o player abre e recebe o foco no botão Pausar; ao fechar, o foco volta para o botão Ler.

- Quando o usuário clica em Ler, então o player abre com o foco em Pausar
- Quando o usuário fecha o player, então o foco volta para o botão Ler

**Idle** — Sem áudio ativo, nada é exibido.

- Então o player não aparece

### AudioPlayer/AudioPlayerBar

Arquivo: `src/ui/components/audio-player/audio-player-bar.stories.tsx`


**Playing**

- (sem passos de interação; verifica renderização e acessibilidade com o axe)

**PausedAndMuted**

- (sem passos de interação; verifica renderização e acessibilidade com o axe)

### AudioPlayer/PlayerButton

Arquivo: `src/ui/components/audio-player/player-button.stories.tsx`


**Default** — Botão do player com ícone e texto curto visível. O `srLabel` completa o nome só para leitores de tela: aqui o nome é "Fechar o player e parar o áudio".

- Então o texto visível é curto
- Quando o usuário clica, então a ação é chamada

**Primary** — Variante principal (destacada), usada no botão de reproduzir.

- Então o nome acessível é só o texto visível

### AudioPlayer/PlayerControls

Arquivo: `src/ui/components/audio-player/player-controls.stories.tsx`


**Playing** — Controles principais do player: voltar 10 segundos, pausar/reproduzir e avançar 10 segundos. Os botões mostram um texto curto e têm um nome acessível completo (por exemplo, "Voltar 10 segundos").

- Quando o usuário clica em Voltar, então o áudio volta 10 segundos
- Quando o usuário clica em Avançar, então o áudio avança 10 segundos
- Quando o usuário clica em Pausar, então a reprodução é alternada

**Paused** — Com o áudio pausado, o botão central vira "Reproduzir".

- Então o botão central se chama Reproduzir

### AudioPlayer/PlayerTimeline

Arquivo: `src/ui/components/audio-player/player-timeline.stories.tsx`


**Default** — Linha do tempo do áudio: um controle deslizante chamado "Progresso do áudio" que fala o tempo por extenso ("12 minutos e 34 segundos de 40 minutos e 10 segundos"). As setas do teclado avançam e voltam.

- Então o tempo é descrito por extenso para leitores de tela
- Então os tempos visíveis aparecem nos dois lados
- Quando o usuário aperta Seta para a direita, então o áudio avança 1 segundo

**WithoutDuration** — Antes de o áudio carregar (duração 0), a linha do tempo fica desativada.

- Então o controle deslizante está desativado

### AudioPlayer/PlayerVolume

Arquivo: `src/ui/components/audio-player/player-volume.stories.tsx`


**Default** — Volume: um botão "Silenciar" do tipo liga/desliga (`aria-pressed`) e um controle deslizante "Volume" que fala o valor em porcentagem.

- Então o volume é anunciado como 80%
- Quando o usuário aperta Seta para a esquerda, então o volume diminui
- Quando o usuário clica em Silenciar, então o som é desligado

**Muted** — Silenciado: o botão aparece pressionado e o volume é anunciado como 0%.

- Então Silenciar está pressionado e o volume é 0%

### EmptyState

Arquivo: `src/ui/components/empty-state.stories.tsx`


**NotFound** — Estado vazio de "página não encontrada": título h1, descrição e um botão de ação. O "404" grande é decorativo e fica escondido de leitores de tela.

- Então o título é o h1 da página
- Quando o usuário clica no botão, então a ação é executada

**NoResults** — Sem ação nem mídia: só o título e a descrição.

- Então aparecem título e descrição, sem botão

### Footer/SiteFooter

Arquivo: `src/ui/components/footer/site-footer.stories.tsx`


**Default** — O rodapé é o landmark `contentinfo`. Cada coluna de links é uma navegação nomeada pelo seu título, e há uma navegação "Informações legais".

- Então o rodapé é o contentinfo da página
- Então cada grupo de links é uma navegação com nome
- Então todo link tem texto e endereço

### Header/HeaderActions

Arquivo: `src/ui/components/header/header-actions.stories.tsx`


**Default** — As ações do cabeçalho: trocar o idioma da interface, abrir o painel de acessibilidade, criar conta e entrar. O seletor de idioma é um menu com opções de rádio, e cada opção tem o atributo `lang` do próprio idioma.

- Então o botão de idioma mostra o idioma atual no nome
- Quando o usuário abre o seletor de idioma, então aparecem as opções
- Quando o usuário aperta Esc, então o menu fecha
- Então Acessibilidade, Criar conta e Entrar estão disponíveis

### Header/HeaderAppearanceMenu

Arquivo: `src/ui/components/header/header-appearance-menu.stories.tsx`


**Default** — No computador, o botão "Acessibilidade" abre um balão (popover) com o painel de preferências. As mudanças valem na hora e o Esc fecha o balão devolvendo o foco ao botão.

- Quando o usuário clica em Acessibilidade, então o painel abre
- Quando o usuário escolhe o tema Escuro, então a página muda na hora
- Quando o usuário aperta Esc, então o painel fecha e o foco volta ao botão

**Mobile** — No celular, o mesmo painel abre como uma gaveta que sobe da parte de baixo da tela.

- Quando o usuário toca em Acessibilidade, então a gaveta com o painel abre
- Quando o usuário aperta Esc, então a gaveta fecha

### Header/HeaderBrand

Arquivo: `src/ui/components/header/header-brand.stories.tsx`


**Default** — A marca mostra o botão do menu e o logotipo. O logotipo é um link com nome descritivo para a página principal.

- Então o botão Abrir menu aparece antes do logotipo
- Então o logotipo é um link para a página principal

### Header/HeaderLanguageSwitcher

Arquivo: `src/ui/components/header/header-language-switcher.stories.tsx`


**Default** — Seletor do idioma da interface. O botão diz o idioma atual no nome e abre um menu com opções de rádio; cada opção é escrita no próprio idioma e tem `lang`. Escolher uma opção troca o idioma; o Esc fecha o menu.

- Então o botão mostra o idioma atual
- Quando o usuário abre o menu, então os idiomas aparecem como opções
- Quando o usuário escolhe English, então o botão passa a mostrar English

### Header/HeaderMenu

Arquivo: `src/ui/components/header/header-menu.stories.tsx`


**Default** — O botão "Abrir menu" abre uma gaveta lateral com a navegação do site. A gaveta é um diálogo com título, tem uma região de navegação nomeada e, ao fechar com Esc, o foco volta para o botão que a abriu.

- Quando o usuário clica em Abrir menu, então a gaveta Menu abre
- Então a gaveta tem a navegação do site com todos os links
- Quando o usuário aperta Esc, então a gaveta fecha e o foco volta ao botão

**CloseWithButton** — O botão "Fechar menu" dentro da gaveta também fecha e devolve o foco.

- Quando o usuário abre o menu e clica em Fechar menu, então a gaveta fecha

### Header/HeaderSearch

Arquivo: `src/ui/components/header/header-search.stories.tsx`


**Default** — O campo de pesquisa tem rótulo "Pesquisar na Wikipédia", segue o padrão combobox (lista fechada no início) e anuncia o atalho Ctrl+K.

- Então o campo é um combobox com rótulo e a lista começa fechada

**ShowsSuggestions** — Ao digitar, aparecem sugestões de artigos (vindas do provedor de pesquisa simulado) e um aviso para leitores de tela diz quantos resultados existem.

- Quando o usuário digita “sistema”, então a lista de sugestões abre
- Então o aviso escondido anuncia a quantidade de resultados
- Quando o usuário digita algo sem resultados, então aparece a mensagem de nada encontrado

**KeyboardNavigation** — As setas do teclado percorrem as sugestões sem tirar o foco do campo (`aria-activedescendant`) e o Esc fecha a lista; um segundo Esc limpa o texto.

- Dado que o usuário digitou “a” e há várias sugestões
- Quando o usuário aperta Seta para baixo, então a primeira sugestão fica ativa
- Quando o usuário aperta Seta para cima, então a seleção volta para a última sugestão
- Quando o usuário aperta Esc, então a lista fecha mas o texto continua
- Quando o usuário aperta Esc de novo, então o texto é apagado

**KeyboardShortcut** — O atalho Ctrl+K (ou ⌘K) leva o foco para o campo de pesquisa de qualquer lugar.

- Quando o usuário aperta Ctrl+K, então o foco vai para a pesquisa

**ClearButton** — O botão "Limpar pesquisa" apaga o texto e devolve o foco para o campo.

- Quando o usuário digita algo, então aparece o botão Limpar pesquisa
- Quando o usuário clica em Limpar pesquisa, então o campo fica vazio e focado

### Header/SiteHeader

Arquivo: `src/ui/components/header/site-header.stories.tsx`


**Default** — No computador, o cabeçalho é um landmark `banner` com o menu, o logotipo (link para a página principal), a pesquisa sempre visível e as ações (idioma, acessibilidade, criar conta e entrar).

- Então o cabeçalho é o banner da página
- Então o logotipo leva para a página principal
- Então a pesquisa fica visível dentro de um landmark search
- Então os botões de ação têm nomes acessíveis

**Mobile** — No celular, a pesquisa fica escondida atrás do botão "Pesquisar". Ao tocar nele, o campo aparece já focado e o botão informa que está expandido.

- Então a pesquisa começa escondida
- Quando o usuário toca em Pesquisar, então o campo aparece focado
- Quando o usuário toca em Pesquisar de novo, então o campo some

### Home/FeaturedArticleCard

Arquivo: `src/ui/components/home/featured-article-card.stories.tsx`


**Default** — O cartão inteiro é clicável, mas para tecnologias assistivas existe um único link: o título do artigo, dentro de um h3. O "Ler artigo" é só visual e fica escondido de leitores de tela.

- Então há um único link, que é o título do artigo
- Então o título é um h3
- Então “Ler artigo” não é lido pelo leitor de tela

**Lead** — Variante de destaque, com imagem decorativa (alt vazio, pois o título já descreve).

- Então o link do título aparece e a imagem é decorativa

### Home/FeaturedArticles

Arquivo: `src/ui/components/home/featured-articles.stories.tsx`


**Default** — Seção "Artigos em destaque": um cartão principal e os demais em grade, com a data dos dados num elemento `<time>`.

- Então a seção é nomeada pelo título Artigos em destaque
- Então há um link para cada artigo em destaque
- Então a data aparece num elemento time

**Loading** — Enquanto os destaques carregam, a área fica `aria-busy` e avisa “Carregando destaques…”.

- Então aparece o aviso de carregamento

**Failed** — Se der erro, aparece uma mensagem pedindo para tentar mais tarde.

- Então aparece a mensagem de erro

**Empty** — Para uma data sem dados, a seção avisa que não há destaques.

- Então aparece Nenhum destaque disponível

### Home/HomeHero

Arquivo: `src/ui/components/home/home-hero.stories.tsx`


**Default** — A abertura da página inicial tem o título principal (h1) "Bem-vindo à Wikipédia".

- Então o título principal da página aparece

### Image/ImageWithFallback

Arquivo: `src/ui/components/image/image-with-fallback.stories.tsx`


**Loaded** — Imagem usada no artigo e na capa da barra lateral. Quando carrega, é um `<img>` comum com texto alternativo.

- Quando a imagem carrega, então ela aparece com o texto alternativo

**Broken** — Quando a imagem não carrega, aparece o quadro “Imagem indisponível” com ícone, nas mesmas proporções da imagem (320×180), e o nome acessível continua descrevendo o que a imagem mostraria.

- Quando a imagem não carrega, então aparece o aviso Imagem indisponível com a descrição
- Então o aviso mantém a proporção da imagem original

**BrokenWithoutDimensions** — Sem largura e altura conhecidas, o aviso usa a proporção 16:9.

- Quando a imagem sem dimensões não carrega, então o aviso usa 16:9

### Motion/AnimatedIcon

Arquivo: `src/ui/components/motion/animated-icon.stories.tsx`


**Default** — Troca um ícone por outro com uma pequena animação (giro e escala). Quando a chave (`iconKey`) muda, o ícone antigo sai e o novo entra.

- Então o ícone inicial é o de reproduzir
- Quando o usuário clica, então o ícone troca para pausar

### Motion/AnimatedPercent

Arquivo: `src/ui/components/motion/animated-percent.stories.tsx`


**Default** — Mostra uma porcentagem arredondada; quando o valor muda, o número “corre” até o novo valor.

- Então o valor aparece como 42%

**Rounded** — Valores quebrados são arredondados.

- Então 66,6 aparece como 67%

### RichText/RichText

Arquivo: `src/ui/components/rich-text/rich-text.stories.tsx`


**AllBlocks** — O RichText recebe uma lista de blocos e escolhe o componente de cada tipo: parágrafo, subtítulo, lista, tabela, imagem e referências — na ordem.

- Então cada tipo de bloco aparece com o elemento certo
- Então a nota no texto aponta para a referência que existe

### RichText/RichTextHeading

Arquivo: `src/ui/components/rich-text/blocks/rich-text-heading.stories.tsx`


**Level3** — Subtítulo dentro de uma seção: h3 por padrão, com `id` para servir de âncora.

- Então é um título de nível 3 com id

**Level4** — Subtítulo de quarto nível (h4).

- Então é um título de nível 4

### RichText/RichTextImage

Arquivo: `src/ui/components/rich-text/blocks/rich-text-image.stories.tsx`


**Default** — Imagem do artigo com texto alternativo e legenda (`figcaption`). A imagem é um botão "Ampliar imagem: …" que abre uma visualização em tela cheia. Fechar (pelo botão ou pelo Esc) devolve o foco para a imagem.

- Então a imagem tem texto alternativo e legenda
- Quando o usuário clica na imagem, então ela abre ampliada com a legenda
- Quando o usuário clica em Fechar, então a imagem ampliada fecha e o foco volta
- Quando o usuário abre de novo e aperta Esc, então também fecha

**WithoutCaption** — Sem legenda: não há `figcaption` e o diálogo usa o texto alternativo como título.

- Então não há legenda
- Quando o usuário amplia a imagem, então o diálogo é nomeado pelo texto alternativo

**BrokenImage** — Quando a imagem não carrega, aparece um aviso desenhado pelo próprio site ("Imagem indisponível") no lugar do ícone de imagem quebrada do navegador. O aviso continua descrevendo a imagem para leitores de tela e não pode ser ampliado. A legenda continua embaixo.

- Quando a imagem não carrega, então aparece o aviso Imagem indisponível com a descrição acessível
- Então não há botão de ampliar e a legenda continua

**BrokenImageWithoutCaption** — Imagem quebrada e sem legenda: só o aviso, sem `figcaption` vazio.

- Quando a imagem não carrega e não há legenda, então só o aviso aparece

### RichText/RichTextList

Arquivo: `src/ui/components/rich-text/blocks/rich-text-list.stories.tsx`


**Unordered** — Lista com marcadores (`ul`): cada item vira um `li`.

- Então é uma lista não ordenada com todos os itens

**Ordered** — Lista numerada (`ol`).

- Então é uma lista ordenada

### RichText/RichTextNote

Arquivo: `src/ui/components/rich-text/blocks/rich-text-note.stories.tsx`


**Default** — Número de nota no meio do texto: mostra "[3]" sobrescrito e é um link chamado "Nota 3" que leva para `#nota-3`. Seu próprio `id` (`ref-3`) é o destino do link "Voltar ao texto".

- Então a nota é um link sobrescrito para a nota 3

### RichText/RichTextParagraph

Arquivo: `src/ui/components/rich-text/blocks/rich-text-paragraph.stories.tsx`


**Default** — Parágrafo normal: um único `<p>` com os números das notas no texto.

- Então há um parágrafo com duas notas

**EasyReading** — Leitura facilitada: o parágrafo é quebrado em blocos de até duas frases. As notas ficam junto da frase a que pertencem.

- Então o parágrafo vira dois blocos e as notas continuam

**WithoutFootnoteMarkers** — Com os números de notas desligados, o texto aparece sem os links de nota.

- Então o texto aparece inteiro e sem números de nota

### RichText/RichTextReferences

Arquivo: `src/ui/components/rich-text/blocks/rich-text-references.stories.tsx`


**Default** — Lista numerada de notas e referências. Cada nota tem o `id` `nota-N` (o destino do número no texto) e, quando existe chamada no texto, um link "Voltar ao texto" que diz, para leitores de tela, a qual nota se refere.

- Então cada nota é um item numerado com id nota-N
- Então as notas com chamada no texto têm Voltar ao texto

**WithoutFootnoteMarkers** — Com os números de notas desligados, a lista continua, mas os links "Voltar ao texto" somem (não existe mais o número para onde voltar).

- Então a lista aparece sem links de volta

### RichText/RichTextTable

Arquivo: `src/ui/components/rich-text/blocks/rich-text-table.stories.tsx`


**Default** — Tabela do artigo: a primeira linha vira cabeçalho (`th scope="col"`). A área da tabela pode receber foco pelo teclado para rolar tabelas largas.

- Então a primeira linha são cabeçalhos de coluna
- Então as demais linhas são dados
- Quando o usuário aperta Tab, então a área da tabela recebe foco

### SkipLink

Arquivo: `src/ui/components/skip-link.stories.tsx`


**Default** — "Pular para o conteúdo" é o primeiro item da página para quem usa teclado. Ele fica invisível até receber foco e leva direto ao conteúdo principal.

- Então o link começa escondido visualmente
- Quando o usuário aperta Tab, então o link é o primeiro a receber foco e aparece
- Então ele aponta para o conteúdo principal (#conteudo)
- Então o alvo pode receber foco (tabindex=-1), para o leitor continuar dali

### TableOfContents

Arquivo: `src/ui/components/table-of-contents/table-of-contents.stories.tsx`


**Default** — Em telas menores, o sumário fica recolhido atrás do botão "Neste artigo". O botão informa se está aberto (`aria-expanded`) e mostra a seção atual. O sumário tem um link para o início e um para cada seção do artigo.

- Então o sumário começa recolhido
- Quando o usuário clica em Neste artigo, então a lista de seções abre
- Então existe um link para cada seção do artigo
- Quando o usuário clica de novo, então o sumário recolhe

**WithArticle** — Sumário ao lado do artigo, como na página real em telas largas. Clicar em uma seção leva o foco para o título dela (quem usa teclado ou leitor de tela continua a leitura dali) e marca o link com `aria-current`.

- Quando o usuário abre o sumário, então a navegação Neste artigo mostra o link Início
- Quando o usuário clica em “…”, então o foco vai para o título da seção
- Então o sumário recolhe e o botão mostra a seção atual

## Layouts


### ArticlePageLayout

Arquivo: `src/ui/layouts/article-page-layout.stories.tsx`


**Default**

- (sem passos de interação; verifica renderização e acessibilidade com o axe)

**Tablet**

- (sem passos de interação; verifica renderização e acessibilidade com o axe)

**Mobile**

- (sem passos de interação; verifica renderização e acessibilidade com o axe)

### ArticlePageLoadingLayout

Arquivo: `src/ui/layouts/article-page-loading-layout.stories.tsx`


**Default** — Tela exibida enquanto o artigo carrega: o cabeçalho já funciona, o conteúdo fica `aria-busy` e um aviso escondido diz “Carregando artigo…”. Os blocos cinza (skeleton) são decorativos.

- Então o conteúdo principal está ocupado e anuncia o carregamento
- Então o cabeçalho e o link de pular já estão disponíveis

### EmptyLayout

Arquivo: `src/ui/layouts/empty-layout.stories.tsx`


**NotFound** — Página 404: conteúdo principal com título h1 "Página não encontrada" e um botão para voltar à página principal.

- Então o main tem o h1 Página não encontrada
- Então o botão leva de volta à página principal e pode ser clicado

**ArticleNotFound** — Variante para quando o artigo pedido não existe.

- Então o h1 é Artigo não encontrado e há o botão Ir para a página inicial

### HomePageLayout

Arquivo: `src/ui/layouts/home-page-layout.stories.tsx`


**Default** — Página inicial completa: link de pular, cabeçalho, conteúdo principal (`main#conteudo`) com o título e os destaques, e o rodapé.

- Então a página tem banner, main e contentinfo e um único h1
- Quando o usuário aperta Tab, então o primeiro foco é Pular para o conteúdo
- Então os artigos em destaque aparecem

**Tablet** — Mesma página em largura de tablet.

- Então os landmarks continuam presentes

**Mobile** — Mesma página no celular: a pesquisa fica atrás do botão Pesquisar.

- Então os landmarks continuam e o botão Pesquisar aparece

## Primitives


### Avatar

Arquivo: `src/ui/primitives/avatar.stories.tsx`


**Default** — Avatar com as iniciais como alternativa quando não há foto.

- Então as iniciais aparecem

**Sizes** — Os três tamanhos disponíveis.

- Então aparecem três avatares

### Badge

Arquivo: `src/ui/primitives/badge.stories.tsx`


**Default** — Selo simples com texto.

- Então o texto do selo aparece

**Variants** — Todas as variantes de cor.

- Então as quatro variantes aparecem

### Button

Arquivo: `src/ui/primitives/button.stories.tsx`


**Default** — Botão padrão: clicar ou apertar Enter/Espaço chama a ação.

- Quando o usuário clica, então a ação é chamada
- Quando o usuário aperta Enter com o foco no botão, então a ação é chamada de novo

**Variants** — Todas as variantes visuais.

- Então há um botão para cada variante

**Sizes** — Todos os tamanhos.

- Então há quatro tamanhos

**Disabled** — Desativado: não pode ser clicado.

- Quando o usuário tenta clicar, então nada acontece

### Card

Arquivo: `src/ui/primitives/card.stories.tsx`


**Default** — Cartão com título, descrição, conteúdo e rodapé com ação.

- Então título, descrição e ação aparecem

**Small** — Variante compacta.

- Então o cartão compacto mostra o título

### DropdownMenu

Arquivo: `src/ui/primitives/dropdown-menu.stories.tsx`


**Default** — Menu suspenso: abre por botão, é navegável pelas setas e tem itens comuns e itens de rádio (`menuitemradio` com `aria-checked`).

- Quando o usuário abre o menu, então as opções aparecem
- Quando o usuário escolhe Pequeno, então ele fica marcado
- Quando o usuário clica em Editar, então a ação roda e o menu fecha

### Empty

Arquivo: `src/ui/primitives/empty.stories.tsx`


**Default** — Bloco de estado vazio com mídia, título, descrição e ação.

- Então título, descrição e botão aparecem

### Input

Arquivo: `src/ui/primitives/input.stories.tsx`


**Default** — Campo de texto: aceita digitação.

- Quando o usuário digita, então o texto aparece no campo

**Disabled** — Desativado: não aceita digitação.

- Então o campo está desativado

**Invalid** — Inválido: marcado com `aria-invalid` para leitores de tela.

- Então o campo é anunciado como inválido

### Kbd

Arquivo: `src/ui/primitives/kbd.stories.tsx`


**Default** — Tecla de atalho, renderizada como `<kbd>`.

- Então o atalho aparece num elemento kbd

**Group** — Combinação de teclas agrupadas.

- Então as três teclas aparecem

### Popover

Arquivo: `src/ui/primitives/popover.stories.tsx`


**Default** — Balão (popover) que abre a partir de um botão. Ele é um diálogo nomeado pelo título e descrito pela descrição; o Esc fecha e o foco volta ao botão.

- Quando o usuário clica no botão, então o balão abre
- Quando o usuário aperta Esc, então o balão fecha e o foco volta ao botão

### ScrollArea

Arquivo: `src/ui/primitives/scroll-area.stories.tsx`


**Default** — Área com rolagem própria: o conteúdo maior que a caixa pode ser rolado.

- Então todo o conteúdo está lá, mesmo o que não cabe
- Quando a área é rolada até o fim, então o último item fica visível

### Separator

Arquivo: `src/ui/primitives/separator.stories.tsx`


**Horizontal** — Separador horizontal.

- Então há um separador horizontal

**Vertical** — Separador vertical.

- Então há um separador vertical

### Sheet

Arquivo: `src/ui/primitives/sheet.stories.tsx`


**Bottom** — Gaveta (sheet) que sobe da parte de baixo. É um diálogo modal com título e descrição; o botão de fechar e o Esc fecham e devolvem o foco.

- Quando o usuário abre a gaveta, então aparece um diálogo nomeado
- Quando o usuário clica em Fechar, então a gaveta fecha e o foco volta

**Left** — Gaveta lateral (esquerda), usada pelo menu do site. Esc fecha.

- Quando o usuário abre e aperta Esc, então a gaveta fecha

### Skeleton

Arquivo: `src/ui/primitives/skeleton.stories.tsx`


**Default** — Bloco de carregamento (skeleton), puramente visual.

- Então o bloco de carregamento aparece

**Shapes** — Formatos combinados (avatar e linhas de texto).

- Então aparecem três blocos

### Slider

Arquivo: `src/ui/primitives/slider.stories.tsx`


**Default** — Controle deslizante acessível: o pegador tem papel `slider`, um nome (`thumbLabel`) e responde às setas, Home e End.

- Então o valor inicial é 40
- Quando o usuário aperta Seta para a direita, então o valor sobe um passo
- Quando o usuário aperta End e Home, então vai ao máximo e ao mínimo

**WithValueText** — Com `getAriaValueText`, o leitor de tela ouve um texto em vez do número.

- Então o valor é anunciado como texto

**Disabled** — Desativado: não responde ao teclado.

- Então o controle está desativado

### Toaster

Arquivo: `src/ui/primitives/sonner.stories.tsx`


**Default** — Avisos temporários (toasts). O `<Toaster />` já vem do provedor da aplicação; aqui os botões disparam um aviso de sucesso e um de erro, que aparecem numa região "Notifications" anunciada por leitores de tela.

- Quando o usuário dispara um sucesso, então o aviso aparece
- Quando o usuário dispara um erro, então o aviso de erro aparece
- Então os avisos ficam numa região que é anunciada
