# PROGRESS.md — Projeto Bullying Site

## Fase atual: FASE 0 ✅ (Inventário + Scaffold)

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
