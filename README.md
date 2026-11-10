# Wikipédia acessível

Redesenho da página de artigo da Wikipédia em português, com foco em acessibilidade (WCAG 2.1 nível AA). Os artigos vêm direto da API do MediaWiki (pt.wikipedia.org).

**Para testar tudo, siga o [COMO-TESTAR.md](COMO-TESTAR.md).**

## O que tem

- **Estrutura:** HTML semântico (`header`, `nav`, `main`, `article`, `aside`, `footer`), ARIA, link "Pular para o conteúdo" e sumário navegável.
- **Teclado:** navegação completa, com foco sempre visível.
- **Painel de aparência:**
  - tema claro, escuro ou alto contraste;
  - tamanho do texto de 87,5% a 200%;
  - espaçamento;
  - fonte OpenDyslexic;
  - leitura facilitada;
  - opção de mostrar ou esconder os números das notas de rodapé.

  As preferências ficam salvas entre sessões e são aplicadas antes da página aparecer.
- **Leitura facilitada:** parágrafos divididos em blocos curtos e um resumo introdutório gerado por IA (OpenRouter).
- **Imagens:** texto alternativo, legenda, ampliação ao clicar e um aviso próprio quando a imagem não carrega.
- **Conteúdo do artigo:** infobox com descrição, notas de rodapé ligadas às referências, e idiomas e data de edição reais.
- **Leitura em voz alta:** gerada no servidor (Kokoro), com player de rótulos visíveis.
- **Layout:** responsivo para desktop, tablet e celular, e sem quebrar com zoom de até 400%.

## Rodando

```bash
pnpm install
cp .env.example .env   # preencha OPENROUTER_API_KEY para o resumo por IA (opcional)
pnpm dev               # http://localhost:3000
pnpm ui:docs           # Storybook em http://localhost:6006
```

## Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | sobe o site em modo de desenvolvimento |
| `pnpm build` / `pnpm start` | gera e roda a versão de produção |
| `pnpm ui:docs` | abre o Storybook com todos os componentes documentados |
| `pnpm test` | roda os testes de interação do Storybook e o axe em cada história |
| `pnpm test:e2e` | roda os testes de ponta a ponta com Playwright e axe (desktop, tablet e celular) |
| `pnpm audit:lighthouse` | gera o relatório do Lighthouse em `reports/lighthouse/` (precisa do site rodando) |
| `pnpm check:types` / `pnpm check:lint` | checam os tipos e o padrão de código |

Com `NEXT_PUBLIC_USE_MOCKS=true`, o site usa os artigos de exemplo de `src/ui/providers/mocks/` em vez da API real. É o modo usado pelos testes e2e.

## Arquitetura

- **Interface (`src/ui`):** os componentes não sabem de onde vêm os dados; eles leem tudo de *contexts* (`src/ui/contexts`).
  - Os *providers* preenchem esses contexts: os reais em `src/ui/providers/mediawiki-*`, `api-*` e `article-audio-provider`, e os de exemplo em `src/ui/providers/mocks`.
  - O Storybook usa os providers de exemplo, então nenhuma história acessa a rede.
  - Mais detalhes em [`docs/testes-de-interface.md`](docs/testes-de-interface.md).
- **Servidor (`src/server`):** contém o resumo por IA e a narração em áudio.

## Leitura em voz alta

O botão **Ler** narra o artigo. O áudio é gerado uma vez para cada versão do conteúdo e voz, e fica salvo no backend.

O fluxo é este:
1. `POST /api/articles/:id/audio` cria um registro `PENDING` no Postgres (Prisma) e publica o evento `article-audio.requested` na fila (Redis/BullMQ).
2. O worker sintetiza a voz (Kokoro), salva o arquivo no Silo (S3) e marca o registro como `READY`.
3. O player toca o áudio por `GET /api/articles/:id/audio/file`.

A lógica fica em `src/server/article-audio` e depende só das interfaces em `ports.ts`. As implementações concretas ficam em `src/server/adapters` e são escolhidas em `src/server/container.ts`.

```bash
docker compose up -d --build   # postgres, redis, silo (:9000/:9001), kokoro (:8880) e worker
pnpm dev
```

O container `worker` aplica as migrações (`prisma migrate deploy`) antes de começar a consumir a fila. Para rodar o worker fora do Docker, use `docker compose stop worker` e depois `pnpm worker`.

## Resumo por IA

`POST /api/articles/:id/summary` envia a introdução do artigo ao OpenRouter e devolve até 3 frases em linguagem simples. O resultado fica em cache na memória.

A rota usa estas variáveis:
- `OPENROUTER_API_KEY`: a chave da API.
- `OPENROUTER_MODEL`: o modelo; o padrão é `google/gemini-2.5-flash-lite`, que é barato e rápido.

Sem a chave, a interface mostra as primeiras frases da introdução.
