# Projeto Bullying

Site de **scrollytelling** (narrativa guiada por rolagem) sobre bullying escolar, com
cenário 3D em tempo real e uma IDE de R embarcada que executa as análises estatísticas
no próprio navegador via **WebR** (R compilado para WebAssembly).

Os dados e gráficos são fundamentados nos microdados do **PeNSE 2024** (Pesquisa Nacional
de Saúde do Escolar) e na pesquisa **TIC Kids Online Brasil 2024** (Cetic.br/NIC.br).

## Estrutura da narrativa

| Seção | Título | Conteúdo |
|---|---|---|
| 01 | Introdução | Resumo da pesquisa e base de dados |
| 02 | Mapeamento do bullying | Perfil das vítimas, faixa etária, gênero e localidade |
| 03 | A prática do bullying | Perfil do agressor e tipos de agressão |
| 04 | Padrões das denúncias | Canais de denúncia e métodos de intervenção |
| 05 | Bullying e saúde mental | Correlação com indicadores emocionais |
| 06 | Soluções | Propostas práticas baseadas em evidências |

## Stack

- **Vite + React 19 + TypeScript**
- **Three.js / @react-three/fiber / drei** — cena 3D (personagem, escola, ilha, bolhas)
- **Zustand** — estado da narrativa
- **WebR** — execução das análises em linguagem R no navegador
- **CodeMirror** — editor de código R da IDE embarcada

## Comandos

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção (tsc -b && vite build)
npm run preview  # pré-visualização do build
npm run lint     # oxlint
```

## Dados e scripts R

- `public/data/` — bases CSV usadas pela IDE WebR.
  - `PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv` (10.000 registros de vitimização/prática)
  - `PeNSE2024_saude_mental_amostra_web.csv` (amostra da base condensada de saúde mental, para uso no navegador)
  - `TIC_Kids_Online_Brasil_2024_G22B.csv` (tabela G22B — canais de revelação)
- `public/r/` — scripts R originais completos (análise offline).
- A IDE usa versões executáveis e fiéis ao conteúdo desses scripts, definidas em `src/r/scripts.ts`.

## Deploy

O workflow `.github/workflows/deploy.yml` publica automaticamente em **GitHub Pages**
a cada push em `main`/`master`.
