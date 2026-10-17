# PROGRESS.md — Projeto Bullying Site

## Fase atual: FASE 2 ✅ (Conteúdo e painel de tópicos testados e corrigidos)

### Correções críticas da tela branca (resolvidas)
1. **`SyntaxError: TopicId`**: com `verbatimModuleSyntax: true`, `OrbitTabs.tsx` precisava importar como `type TopicId`.
2. **403 Forbidden no `Environment preset="city"`**: Drei tentava baixar HDR de `raw.githack.com` bloqueado pelo Cloudflare. Substituído por iluminação offline nativa Frutiger Aero (luz hemisférica céu/grama + direcional + pontual).
3. **`Suspense` no Canvas**: `SceneContent` envolvido em `<Suspense fallback={null}>` dentro do Canvas e modelo protegido com `ModelErrorBoundary`.
4. **Build limpo**: remoção de imports não utilizados (`noUnusedLocals`); `npm run build` passa com 0 erros.

### Dinâmica de Scrollytelling e Iluminação Frutiger Aero (implementadas)
1. **Restauração da Iluminação Daylight**: Retorno à luz limpa e cristalina de céu azul (`#6ec6ff` → `#eaf8ff`), sol suave, bolhas em tom ciano translúcido e ilha verde vibrante.
2. **Dinâmica de Scrollytelling com Zoom**:
   - Remoção dos cards 3D orbitais e de `OrbitControls` (sem arraste manual da câmera).
   - O scroll da página move a narrativa: cada seção dispara uma interpolação suave de zoom (`CameraRig` com interpolação `lerp` de posição e FOV/alvo).
   - Menu lateral de dots e atalhos de teclado (setas/PageUp/PageDown) para salto rápido entre tópicos.
3. **Seção de Introdução**: Resumo em tópicos dos desafios, objetivos e base PeNSE 2024 extraídos do documento original.
4. **Tópicos 02 a 05**:
   - Centro: Modelo 3D (`frutiger_aero_character_v2.glb`) girando constantemente em 3D nativo.
   - Esquerda: Resumo objetivo do tópico (sem nomes de apresentadores).
   - Direita: IDE Interativo em R com editor de código, status WebR e viewport para gráficos.
5. **Conclusão (Tópico 06)**:
   - Centro: Modelo 3D estilizado de Casa (`HouseModel.tsx`), simbolizando o acolhimento seguro da escola como segunda família.
   - Conteúdo: Somente o resumo das soluções práticas (sem IDE R).
6. **Cenário e Escola Suaves**:
   - Chão repleto por grama ampla e uniforme (`Island.tsx`).
   - Escola ao fundo em estética moderna, limpa e minimalista (`SchoolBackground.tsx`), com janelas em vidro suave e árvores esféricas.

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
