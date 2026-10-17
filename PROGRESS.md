# PROGRESS.md — Projeto Bullying Site

## Fase atual: FASE 2 ✅ (Conteúdo e painel de tópicos testados e corrigidos)

### Correções críticas da tela branca (resolvidas)
1. **`SyntaxError: TopicId`**: com `verbatimModuleSyntax: true`, `OrbitTabs.tsx` precisava importar como `type TopicId`.
2. **403 Forbidden no `Environment preset="city"`**: Drei tentava baixar HDR de `raw.githack.com` bloqueado pelo Cloudflare. Substituído por iluminação offline nativa Frutiger Aero (luz hemisférica céu/grama + direcional + pontual).
3. **`Suspense` no Canvas**: `SceneContent` envolvido em `<Suspense fallback={null}>` dentro do Canvas e modelo protegido com `ModelErrorBoundary`.
4. **Build limpo**: remoção de imports não utilizados (`noUnusedLocals`); `npm run build` passa com 0 erros.

### Alterações de Design e R Interativo (solicitadas pelo usuário)
1. **Remoção de textos descritivos**: `TopicPanel.tsx` e `MobileTopicPanel` tiveram todos os parágrafos de texto removidos, dedicando o painel integralmente ao **IDE interativo em R** (editor de código com scripts pré-carregados, área de dispositivo gráfico Canvas 800x500 e atalhos).
2. **Órbita estática com flutuação orgânica**: Em `OrbitTabs.tsx`, as abas pararam de girar em torno do centro e foram posicionadas em um arco frontal panorâmico, flutuando suavemente de forma independente no eixo Y e com leve inclinação.
3. **Estilo pmndrs `cards-with-border-radius`**: Cards verticais com `RoundedBox` suave (raio 0.16), contorno externo dourado com brilho especular, corpo interno de vidro fosco, pílula de número, tipografia limpa e elevação em hover com cursor pointer.
4. **Iluminação dourada e cores quentes (fim de tarde nostálgico)**: Paleta de sunset no `theme.css` e em `Scene.tsx` (sol direcional `#ffc87a`, luz hemisférica céu âmbar / chão ameixa, névoa suave no horizonte, anéis de latão e cobre na ilha, bolhas iridescentes em tom dourado).
5. **Estruturas escolares no fundo**: Criado `src/scene/SchoolBackground.tsx` com pavilhão central, torre do relógio iluminada, janelas brilhantes com luz acolhedora de sala de aula e árvores em tons de outono.

### Erros de digitação detectados no documento original (para decisão do usuário)
1. Tópico 02, §2: "segundo **gráficos**" (deveria ser "segundo **gráfico**")
2. Tópico 05, §3: "extrema prioridade**  **e urgência" (espaço duplo)

## Fase 1 ✅ (Cena 3D do hub)

### Arquivos criados na Fase 1
- `src/state/useStory.ts` — Zustand store (view, openTopic, close, next, prev)
- `src/scene/Scene.tsx` — Canvas principal, luzes, camera rig com lerp
- `src/scene/CentralModel.tsx` — modelo GLB auto-escalado (altura alvo 2u), rotação em hub
- `src/scene/Bubbles.tsx` — 14 bolhas flutuantes com Float + MeshPhysicalMaterial
- `src/scene/Island.tsx` — disco verde-grama + 3 anéis aqua + ContactShadows
- `src/scene/OrbitTabs.tsx` — 6 abas orbitais RoundedBox+Billboard, hover glow/escala

## Fase 0 ✅ (Inventário + Scaffold)

## Decisões registradas
- Stack: Vite + React 18 + TS, R3F, Drei, Zustand, WebR, CodeMirror, Nunito Sans
- Modelo 3D: `frutiger_aero_character_v2.glb` (0.24 MB)
- Nenhum `.docx` foi convertido para `.md` ainda (Fase 2 precisará ler o conteúdo)

## Mapeamento de arquivos: original → destino

| Original | Destino |
|---|---|
| `frutiger_aero_character_v2.glb` | `public/model/frutiger_aero_character_v2.glb` |
| `Projeto_bullying.R` | `public/r/Projeto_bullying.R` |
| `Projeto_bullying2.R` | `public/r/Projeto_bullying2.R` |
| `grafico_canais_denuncia_G22B.R` | `public/r/grafico_canais_denuncia_G22B.R` |
| `PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv` | `public/data/PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv` |
| `PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv` | `public/data/PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv` |
| `TIC_Kids_Online_Brasil_2024_G22B.csv` | `public/data/TIC_Kids_Online_Brasil_2024_G22B.csv` |
| `Projeto Bullying 2026 IA A (1).docx` | `docs/` (a copiar) |
| `Projeto Bullying.docx` | `docs/` (a copiar) |

## Mapeamento R scripts → tópicos (confirmado pelo usuário)
- `Projeto_bullying.R` → tópico 02 (Mapeamento) + tópico 03 (Prática do bullying)
- `Projeto_bullying2.R` → tópico 04 (Denúncias) + tópico 05 (Saúde mental)
- `grafico_canais_denuncia_G22B.R` → tópico 04 (Denúncias)

## Pacotes R detectados por script
- `Projeto_bullying.R`: ggplot2, tidyverse, lubridate, dplyr, scales (via tidyverse)
- `Projeto_bullying2.R`: ggplot2, dplyr, tidyverse, lubridate
- `grafico_canais_denuncia_G22B.R`: readr, dplyr, ggplot2

## Arquivos importantes
- `src/styles/theme.css` — tokens Frutiger Aero
- `src/App.tsx` — entry point (placeholder fase 0)
- `src/main.tsx` — bootstrap React
- `index.html` — lang=pt-BR, meta desc

## Estrutura src
```
src/
├─ scene/       ← Fase 1
├─ ui/          ← Fase 2
├─ r/           ← Fase 3
├─ content/     ← Fase 2
├─ styles/theme.css
└─ state/       ← Fase 1
```

## Pendências
- Copiar `.docx` para `docs/` (não urgente — Fase 2 lê o conteúdo)
- Fase 2: extrair textos dos `.docx` (ler manualmente ou pedir ao usuário versão .md/.txt)
- Scripts R usam `ggsave()`? → Não (verificado). Usam `png()/dev.off()`? → Não. OK para WebR.
- `lubridate` pode não estar disponível no WebR → verificar na Fase 3.
