# Como testar

Guia passo a passo para conferir tudo o que o projeto entrega. Não precisa saber programar: é só copiar os comandos e seguir as listas.

---

## 1. Preparar (uma vez só)

Você precisa de:

- **Node.js 20 ou mais novo** ([nodejs.org](https://nodejs.org))
- **pnpm**: depois de instalar o Node, rode `corepack enable`
- **Internet**, porque os artigos vêm da Wikipédia de verdade
- *(Opcional)* **Docker**, só para a leitura em voz alta (seção 4.10)

No terminal, dentro da pasta do projeto:

```bash
pnpm install
pnpm exec playwright install chromium   # navegador usado pelos testes automáticos
cp .env.example .env                    # arquivo de configuração
```

Para ativar o **resumo por IA** da leitura facilitada, abra o `.env` e preencha a chave do [OpenRouter](https://openrouter.ai/keys):

```
OPENROUTER_API_KEY=sua-chave-aqui
```

Sem a chave tudo funciona igual. A única diferença é que, no lugar do resumo, aparece o começo da introdução do artigo.

---

## 2. Abrir o site

```bash
pnpm dev
```

Abra **http://localhost:3000**. Bons artigos para testar:

- http://localhost:3000/articles/Shawn_Mendes (tem imagens, infobox e notas)
- http://localhost:3000/articles/Brasil (artigo grande)
- http://localhost:3000/articles/Mega-Sena (tem tabelas)

---

## 3. Testes automáticos (um comando cada)

| O que testa | Comando | Resultado esperado |
|---|---|---|
| Erros de código (tipos) | `pnpm check:types` | termina sem erros |
| Padrão de código | `pnpm check:lint` | "No fixes applied" |
| **Componentes no Storybook**: 150 testes de interação, cada um com checagem automática de acessibilidade (axe) | `pnpm test` | `150 passed` |
| **Site inteiro no navegador** (desktop, tablet e celular): axe/WCAG 2.1 AA, teclado, preferências salvas, zoom sem quebrar o layout, imagens com descrição, leitura facilitada e artigo em menos de 3 s | `pnpm test:e2e` | `105 passed` (21 são pulados de propósito: os testes de zoom rodam só no desktop, e o teste com rede real só roda se você ativar) |
| **Lighthouse** (nota de acessibilidade e desempenho) | com o `pnpm dev` aberto: `pnpm audit:lighthouse` | acessibilidade ≥ 95 (deu **100**); o relatório fica em `reports/lighthouse/` |

> O `pnpm test:e2e` usa dados de exemplo (modo mock) e roda sozinho, na porta 3100. Não precisa de internet nem do `pnpm dev`.
>
> Para medir o tempo de carregamento com a Wikipédia real: deixe o `pnpm dev` aberto e rode `E2E_LIVE=1 pnpm test:e2e performance`.

### Ver os testes de componentes com os próprios olhos

```bash
pnpm ui:docs
```

Abra **http://localhost:6006**. Em qualquer componente, veja:

- o painel **Interactions**, que mostra o teste rodando passo a passo, com frases como "Quando o usuário… então…";
- o painel **Accessibility**, que mostra o resultado do axe.

A explicação de cada teste, em português, está em [`docs/testes-de-interface.md`](docs/testes-de-interface.md).

---

## 4. Roteiro manual (item por item do escopo)

Marque cada item conforme for conferindo. Use um artigo como o **Shawn Mendes**.

### 4.1 Navegação só pelo teclado (sem mouse)
- [ ] Recarregue a página e aperte **Tab** uma vez. Aparece o botão **"Pular para o conteúdo"**.
- [ ] Aperte **Enter**. O foco pula direto para o artigo.
- [ ] Continue apertando **Tab**. Todo item focado ganha um **contorno visível**.
- [ ] No **sumário** ("Neste artigo"), aperte Enter num tópico. A página rola até a seção e o foco vai para o título dela.
- [ ] Aperte **Ctrl + K** (no Mac, **Cmd + K**). O foco vai para a busca. Digite "Brasil", use as **setas** e aperte **Enter**. O artigo abre.
- [ ] **Esc** fecha as sugestões da busca e também qualquer painel ou menu aberto.

### 4.2 Painel de aparência
Clique no ícone de aparência no topo, à direita (no celular ele abre embaixo).
- [ ] **Tema**: Claro, Escuro e **Alto contraste** (fundo preto, texto branco, destaques amarelos).
- [ ] **Tamanho do texto**: os botões − e + vão de 87,5% a 200%.
- [ ] **Espaçamento**: Padrão, Amplo e Mais amplo (aumenta o espaço entre linhas, letras e palavras).
- [ ] **Fonte para dislexia**: o texto muda para a OpenDyslexic.
- [ ] **Leitura facilitada**: veja a seção 4.5.
- [ ] **Números de notas de rodapé**: desligado, os números [1], [2]… somem do meio do texto. As notas continuam no fim do artigo.
- [ ] **Restaurar padrão** volta tudo ao início.

### 4.3 Preferências mantidas entre sessões
- [ ] Escolha **Alto contraste** e texto em **150%**.
- [ ] **Feche o navegador**, abra de novo e entre no site. Tudo continua como você deixou, sem "piscar" o tema antigo ao carregar.

### 4.4 Layout responsivo e zoom
- [ ] Aperte **Ctrl/Cmd e +** até **400%**. O texto se reorganiza e não aparece rolagem para os lados.
- [ ] Abra as ferramentas do navegador (**F12**), ative o modo celular (ícone de celular/tablet) e teste em 320px, 768px e 1280px de largura. No celular, o sumário vira um botão que abre e fecha, e a busca aparece pela lupa.
- [ ] Tabelas largas rolam dentro do próprio quadro, sem quebrar a página.

### 4.5 Leitura facilitada
- [ ] Ative **Leitura facilitada** no painel de aparência.
- [ ] Os parágrafos longos ficam divididos em **blocos curtos** (até 2 frases cada).
- [ ] No topo do artigo aparece o quadro **"Resumo simplificado"**, com até 3 frases geradas por IA. Sem a chave do OpenRouter, o quadro aparece como **"Introdução do artigo"**, com as 2 primeiras frases da Wikipédia.

### 4.6 Imagens, infobox, legendas e notas
- [ ] As imagens do texto aparecem **grandes e centralizadas**, com a **legenda centralizada** embaixo.
- [ ] Clique numa imagem. Ela abre ampliada por cima da página. Fecha com **Fechar**, **Esc** ou com um clique fora da imagem, sem piscar.
- [ ] À direita, o card da **infobox** mostra a foto de capa, a legenda e os dados (nascimento, ocupação…).
- [ ] Se uma imagem não carregar, aparece o aviso **"Imagem indisponível"** com um ícone, e não o ícone quebrado do navegador. Para forçar: com F12 aberto, na aba Network, bloqueie `upload.wikimedia.org` e recarregue. Ou veja no Storybook: *RichTextImage → Broken image*.
- [ ] Clique num número de nota, como **[1]**. Você vai para **"Notas e referências"** no fim do artigo. O link **"↑ Voltar ao texto"** traz você de volta ao mesmo ponto.
- [ ] O card **Idiomas** mostra os idiomas reais em que o artigo existe.

### 4.7 Leitor de tela (pessoas cegas)
Ligue o leitor de tela:

- **Mac (VoiceOver):** **Cmd + F5** liga e desliga. Use **VO = Ctrl + Option**:
  - **VO + U** abre o "rotor", com listas de títulos, links e regiões. Use as setas para trocar de lista.
  - **VO + →** lê o próximo item.
- **Windows (NVDA, gratuito em [nvaccess.org](https://www.nvaccess.org)):** **Ctrl + Alt + N** liga.
  - **H** pula de título em título.
  - **D** pula de região em região.
  - **Insert + F7** lista os links e títulos.

Confira:
- [ ] As **regiões** são anunciadas: banner (topo), navegação, busca, principal (o artigo), complementar ("Sobre o artigo") e rodapé.
- [ ] Os **títulos** seguem uma ordem lógica: um único título nível 1 (o nome do artigo), depois as seções (nível 2) e as subseções (nível 3).
- [ ] As **imagens** são lidas pela descrição, como "Ampliar imagem: Mendes na abertura da turnê…".
- [ ] Os **botões com ícone** são lidos pelo nome, como "Abrir menu", "Aparência" e "Ler o artigo em voz alta".
- [ ] As **notas** são lidas como "Nota 1", e não como "colchete 1".
- [ ] Na **busca**, o leitor anuncia quantos resultados apareceram.
- [ ] No sumário, o item da seção atual é anunciado como "atual".

### 4.8 Contraste (nível AA)
- [ ] Já verificado automaticamente: o `pnpm test:e2e` roda o axe nos três temas e o Lighthouse deu 100.
- [ ] Para conferir na mão: no Chrome, abra F12, clique com o **botão direito** num texto, escolha **Inspecionar** e passe o mouse sobre a cor. A janela mostra o "Contrast ratio" com ✓ AA.

### 4.9 Desempenho (artigo em até 3 s)
- [ ] Abra um artigo com **F12 → Network** aberto e veja o tempo até o título aparecer. Nos testes ficou entre ~1 e 1,2 s com a Wikipédia real.

### 4.10 Leitura em voz alta (opcional, precisa do Docker)
```bash
docker compose up -d --build
pnpm dev
```
- [ ] Num artigo, clique em **Ler**. O botão mostra o progresso da geração e depois o player aparece embaixo.
- [ ] Todos os botões do player têm **texto visível**: Voltar, Reproduzir/Pausar, Avançar, Silenciar e Fechar.
- [ ] Sem o Docker rodando, aparece um aviso de que não foi possível gerar o áudio, e o resto do site continua funcionando.

---

## 5. Se algo der errado

| Problema | Solução |
|---|---|
| `pnpm: command not found` | rode `corepack enable` |
| Os testes reclamam de navegador ausente | rode `pnpm exec playwright install chromium` |
| `pnpm test:e2e` usa uma versão antiga do site | feche o que estiver rodando na porta 3100 e rode de novo |
| O resumo mostra "Introdução do artigo" | falta a `OPENROUTER_API_KEY` no `.env`; reinicie o `pnpm dev` depois de preencher |
| O artigo não carrega | confira a internet; o site busca os artigos direto da Wikipédia |
