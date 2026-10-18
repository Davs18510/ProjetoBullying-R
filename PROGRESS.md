# PROGRESS.md — Projeto Bullying Site

## Fase atual: FASE 3 ✅ (Execução real em R/WebR no navegador)

### Fase 3 — IDE R com WebR (implementada)
1. **`src/r/scripts.ts`** — uma tarefa R por tópico (`mapeamento`, `pratica`, `denuncias`, `saude`)
   com código **executável e fiel** aos scripts originais, usando os **nomes reais de coluna**
   (`MODALIDADE_BULLYING_SOFRIDO`, `FAIXA_ETARIA`, `TIPOS_AGRESSAO_PRATICADA`, `recorte`/`categoria`/
   `canal_resposta` da tabela G22B, `B07007B`/`B12004`–`B12007` etc.).
2. **`src/r/webrClient.ts`** — singleton WebR carregado por `import()` dinâmico da CDN
   (`https://webr.r-wasm.org/v0.6.0/webr.mjs`), fora do bundle inicial. Instala pacotes
   (`ggplot2`) e monta os CSVs em `/home/web_user` uma única vez (cache). A execução usa
   `globalShelter.captureR(..., { captureGraphics: true })`, retornando a saída de console e os
   gráficos como `ImageBitmap`.
3. **`src/r/RStudio.tsx`** — IDE embarcada: editor **CodeMirror** com modo R, botão "Executar R",
   linha de status, console de saída e viewport que desenha o gráfico capturado em um `<canvas>`.
4. **`src/ui/Scrollytelling.tsx`** — os placeholders com `alert(...)` foram substituídos por
   `<RStudio topicId={...} />` nos tópicos 02–05.
5. **Dados para o navegador** — `public/data/PeNSE2024_saude_mental_amostra_web.csv`
   (amostra de 4.000 registros da base condensada, 1,9 MB) para viabilizar o tópico 05 no browser
   (a base original tem 75 MB). O script R offline continua usando a base completa.

### Correções de consistência (implementadas)
1. **Nomes fictícios de colunas/arquivos eliminados**: os trechos R que citavam `MODALIDADE`,
   `BULLYING`, `FREQUENCIA_BULLYING`, `NIVEL_BULLYING`, `INDICE_SAUDE_MENTAL`, `CANAL`, `CASOS` e
   arquivos inexistentes (`metodologia_pense.R`, `propostas_intervencao.R`) foram removidos.
2. **Código morto removido**: `src/ui/TopicPanel.tsx`, `src/ui/StoryNav.tsx`,
   `src/ui/MobileMenu.tsx` (fluxo antigo de painel lateral não usado) e `src/scene/OrbitTabs.tsx`
   (abas 3D com apresentadores desatualizados), além de `src/index.css` e assets não usados
   (`src/assets/hero.png`, `src/assets/vite.svg`).
3. **Erros de digitação no conteúdo** corrigidos em `src/content/topics.ts`:
   "segundo gráficos" → "segundo gráfico"; "prioridade  e urgência" → "prioridade e urgência".
4. **`index.html`** — favicon passa a apontar para `public/favicon.svg` (antes apontava para
   `/vite.svg`, inexistente).
5. **`Bubbles.tsx`** — removida a lógica de pausa baseada em `view !== 'hub'` (nunca verdadeira no
   scrollytelling) e substituído `Math.random` por gerador determinístico (lint limpo).
6. **`package.json`** — nome do pacote `scaffold` → `projeto-bullying`.
7. **`README.md`** — reescrito para o projeto real (antes era o template do Vite).
8. **`docs/`** — `.docx` originais copiados.

## Fase 2 ✅ (Conteúdo e painel de tópicos)

### Correções críticas da tela branca (resolvidas)
1. **`SyntaxError: TopicId`**: com `verbatimModuleSyntax: true`, `OrbitTabs.tsx` precisava importar como `type TopicId`.
2. **403 Forbidden no `Environment preset="city"`**: Drei tentava baixar HDR de `raw.githack.com` bloqueado pelo Cloudflare. Substituído por iluminação offline nativa Frutiger Aero (luz hemisférica céu/grama + direcional + pontual).
3. **`Suspense` no Canvas**: `SceneContent` envolvido em `<Suspense fallback={null}>` dentro do Canvas e modelo protegido com `ModelErrorBoundary`.
4. **Build limpo**: remoção de imports não utilizados (`noUnusedLocals`); `npm run build` passa com 0 erros.

### Dinâmica de Scrollytelling e Iluminação Frutiger Aero (implementadas)
1. **Restauração da Iluminação Daylight**: luz limpa e cristalina de céu azul (`#6ec6ff` → `#eaf8ff`), sol suave, bolhas em tom ciano translúcido e ilha verde vibrante.
2. **Dinâmica de Scrollytelling com Zoom**: o scroll move a narrativa; cada seção dispara interpolação suave de zoom (`CameraRig` com `lerp` de posição e alvo). Menu lateral de dots e atalhos de teclado.
3. **Seção de Introdução**: resumo em tópicos dos desafios, objetivos e base PeNSE 2024.
4. **Tópicos 02 a 05**: centro com modelo 3D girando; esquerda com resumo; direita com a IDE R.
5. **Conclusão (Tópico 06)**: modelo 3D de casa (escola como segunda família) + resumo das soluções.
6. **Cenário suave**: chão de grama amplo (`Island.tsx`) e escola minimalista (`SchoolBackground.tsx`).

## Fase 1 ✅ (Cena 3D do hub)
- `src/state/useStory.ts`, `src/scene/Scene.tsx`, `src/scene/CentralModel.tsx`, `src/scene/Bubbles.tsx`, `src/scene/Island.tsx`.

## Fase 0 ✅ (Inventário + Scaffold)

## Decisões registradas
- Stack: Vite + React 19 + TS, R3F, Drei, Zustand, WebR, CodeMirror, Nunito Sans
- Modelo 3D: `frutiger_aero_character_v2.glb` (0.24 MB)
- WebR pinado em `v0.6.0` (mesma versão do pacote npm), carregado via CDN como módulo ES nativo.

## Mapeamento de arquivos: original → destino

| Original | Destino |
|---|---|
| `frutiger_aero_character_v2.glb` | `public/model/frutiger_aero_character_v2.glb` |
| `Projeto_bullying.R` | `public/r/Projeto_bullying.R` |
| `Projeto_bullying2.R` | `public/r/Projeto_bullying2.R` |
| `grafico_canais_denuncia_G22B.R` | `public/r/grafico_canais_denuncia_G22B.R` |
| `PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv` | `public/data/…` |
| `PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv` | `public/data/…` + amostra web |
| `TIC_Kids_Online_Brasil_2024_G22B.csv` | `public/data/TIC_Kids_Online_Brasil_2024_G22B.csv` |
| `Projeto Bullying 2026 IA A (1).docx` | `docs/Projeto Bullying 2026 IA A (1).docx` |
| `Projeto Bullying.docx` | `docs/Projeto Bullying.docx` |

## Mapeamento R scripts → tópicos (confirmado pelo usuário)
- `Projeto_bullying.R` → tópico 02 (Mapeamento) + tópico 03 (Prática do bullying)
- `Projeto_bullying2.R` → tópico 04 (Denúncias) + tópico 05 (Saúde mental)
- `grafico_canais_denuncia_G22B.R` → tópico 04 (Denúncias)

## Pendências
- Testar a execução WebR em navegador real (o build e o lint passam; a CDN e o pacote `ggplot2`
  para R 4.6.0 foram verificados como disponíveis).
- O primeiro "Executar R" baixa o runtime (~20 MB) e instala `ggplot2`, o que pode demorar.
- `lubridate` não é usado nos scripts executáveis da IDE (as análises não dependem dele).
