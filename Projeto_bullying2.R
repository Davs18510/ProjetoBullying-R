library(ggplot2)
library(dplyr)
library(tidyverse)
library(lubridate)

#========================
# 0 - Preparativos ======
#========================

# Importar a base condensada
data_base <- read_csv(
  "PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv",
  show_col_types = FALSE
)

# Criar indicador de ocorrência de vitimização
base_analise <- data_base %>%
  mutate(
    vit_verbal = case_when(
      B07007B %in% 2:4 ~ 1L,
      B07007B == 1 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    vit_exclusao = case_when(
      B07011A %in% 2:4 ~ 1L,
      B07011A == 1 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    vit_fisica = case_when(
      B07012A %in% 2:4 ~ 1L,
      B07012A == 1 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    vit_cyber = case_when(
      B07013 == 1 ~ 1L,
      B07013 == 2 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    BULLYING_OCORREU_BIN = case_when(
      vit_verbal == 1 |
        vit_exclusao == 1 |
        vit_fisica == 1 |
        vit_cyber == 1 ~ 1L,
      
      vit_verbal == 0 &
        vit_exclusao == 0 &
        vit_fisica == 0 &
        vit_cyber == 0 ~ 0L,
      
      TRUE ~ NA_integer_
    )
  )

# Função para formatar números no padrão brasileiro
formatar_numero <- function(x) {
  format(
    round(x),
    big.mark = ".",
    decimal.mark = ",",
    scientific = FALSE,
    trim = TRUE
  )
}

# ==========================================================
# GRÁFICO 1 — SUPORTE ESCOLAR RELEVANTE PARA A REVELAÇÃO
# E O ENCAMINHAMENTO DE CASOS DE BULLYING
# ==========================================================

# Mantém apenas ações e serviços que podem apoiar o estudante
# depois de relatar um caso: apoio psicológico, profissionais
# de saúde mental, serviços de saúde e apoio de adultos/escola.
# Foram retiradas ações amplas/genéricas de prevenção.

dados_prevencao <- base_analise %>%
  transmute(
    vitimizacao = BULLYING_OCORREU_BIN,
    
    `Suporte psicológico para bullying ou violência (E01P117)` = case_when(
      E01P117 %in% 1:3 ~ 1L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    `Profissional de saúde mental da escola` = case_when(
      E01P11801 == 1 ~ 1L,
      E01P11801 == 0 ~ 0L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    `Profissional de saúde mental terceirizado` = case_when(
      E01P11802 == 1 ~ 1L,
      E01P11802 == 0 ~ 0L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    `Apoio de UBS, equipe de saúde ou CAPS` = case_when(
      E01P11803 == 1 ~ 1L,
      E01P11803 == 0 ~ 0L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    `Apoio escolar sem profissional de saúde` = case_when(
      E01P11804 == 1 ~ 1L,
      E01P11804 == 0 ~ 0L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    ),
    
    `Outro suporte/estrutura de atendimento psicológico` = case_when(
      E01P11805 == 1 ~ 1L,
      E01P11805 == 0 ~ 0L,
      E01P117 == 4 ~ 0L,
      TRUE ~ NA_integer_
    )
  ) %>%
  pivot_longer(
    cols = -vitimizacao,
    names_to = "metodo",
    values_to = "acao"
  ) %>%
  filter(
    !is.na(vitimizacao),
    !is.na(acao)
  ) %>%
  mutate(
    acao = factor(
      if_else(acao == 1, "Sim", "Não"),
      levels = c("Sim", "Não")
    )
  )

# Contar apenas estudantes que relataram vitimização e o total
# de estudantes em cada grupo. Não calcular nem mostrar percentuais.
resumo_prevencao <- dados_prevencao %>%
  group_by(metodo, acao) %>%
  summarise(
    n_estudantes = n(),
    n_vitimas = sum(vitimizacao == 1),
    .groups = "drop"
  ) %>%
  mutate(
    rotulo = paste0("Vítimas: ", formatar_numero(n_vitimas))
  )

# Ordenar os métodos pela contagem de vítimas entre as escolas
# que informaram possuir a ação/suporte.
ordem_metodos <- resumo_prevencao %>%
  filter(acao == "Sim") %>%
  arrange(n_vitimas) %>%
  pull(metodo) %>%
  as.character()

resumo_prevencao <- resumo_prevencao %>%
  mutate(
    metodo = factor(metodo, levels = unique(ordem_metodos))
  )

# Gráfico de barras horizontais agrupadas: somente contagem de vítimas.
grafico_prevencao <- ggplot(
  resumo_prevencao,
  aes(
    x = metodo,
    y = n_vitimas,
    fill = acao
  )
) +
  geom_col(
    position = position_dodge(width = 0.82),
    width = 0.72
  ) +
  geom_text(
    aes(label = rotulo),
    position = position_dodge(width = 0.82),
    hjust = -0.08,
    size = 3
  ) +
  coord_flip() +
  scale_fill_manual(
    values = c("Sim" = "#277DA1", "Não" = "#B8B8B8")
  ) +
  scale_y_continuous(
    labels = formatar_numero,
    expand = expansion(mult = c(0, 0.25))
  ) +
  labs(
    title = "Vitimização segundo o suporte disponível na escola",
    subtitle = paste(
      "Contagem de estudantes vitimizados em escolas que informaram",
      "(Sim) ou não informaram (Não) cada tipo de suporte."
    ),
    x = "Ação ou tipo de suporte informado pela escola",
    y = "Número de estudantes que relataram vitimização",
    fill = "A escola informou o suporte?",
    caption = paste(
      "Os grupos podem ter tamanhos diferentes; contagens absolutas,",
      "isoladamente, não medem a efetividade do suporte."
    )
  ) +
  theme_minimal(base_size = 11) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    axis.text.y = element_text(size = 9),
    panel.grid.major.y = element_blank(),
    legend.position = "bottom",
    plot.caption = element_text(size = 8, hjust = 0)
  )

print(grafico_prevencao)

# Tabela auxiliar com contagem de vítimas e tamanho de cada grupo
print(
  resumo_prevencao %>%
    select(metodo, acao, n_vitimas, n_estudantes)
)

# ==========================================================
# GRÁFICO 2 — VITIMIZAÇÃO E INDICADORES EMOCIONAIS
# ==========================================================

# 1. Identificar a ocorrência de vitimização
dados <- data_base %>%
  mutate(
    BULLYING_OCORREU_BIN = case_when(
      B07007B %in% 2:4 |
        B07011A %in% 2:4 |
        B07012A %in% 2:4 |
        B07013 == 1 ~ 1L,
      
      B07007B == 1 &
        B07011A == 1 &
        B07012A == 1 &
        B07013 == 2 ~ 0L,
      
      TRUE ~ NA_integer_
    ),
    
    GRUPO_VITIMIZACAO = case_when(
      BULLYING_OCORREU_BIN == 1 ~ "Relatou vitimização",
      BULLYING_OCORREU_BIN == 0 ~ "Não relatou vitimização",
      TRUE ~ NA_character_
    )
  )

# 2. Organizar os quatro indicadores emocionais
dados_longos <- dados %>%
  select(
    GRUPO_VITIMIZACAO,
    PESO_ALUNO_FREQ,
    B12004, B12005, B12006, B12007
  ) %>%
  pivot_longer(
    cols = c(B12004, B12005, B12006, B12007),
    names_to = "variavel",
    values_to = "resposta"
  ) %>%
  filter(
    !is.na(GRUPO_VITIMIZACAO),
    resposta %in% 1:5,
    !is.na(PESO_ALUNO_FREQ),
    is.finite(PESO_ALUNO_FREQ),
    PESO_ALUNO_FREQ > 0
  ) %>%
  mutate(
    indicador = recode(
      variavel,
      
      B12004 = paste(
        "Sintoma associado à ansiedade",
        "(preocupação frequente)"
      ),
      
      B12005 = paste(
        "Sintoma associado ao humor depressivo",
        "(tristeza frequente)"
      ),
      
      B12006 = paste(
        "Falta de apoio percebida",
        "(sofrimento emocional)"
      ),
      
      B12007 = paste(
        "Sintoma inespecífico",
        "(irritabilidade/nervosismo)"
      )
    ),
    
    # 4 = Na maioria das vezes; 5 = Sempre
    indicador_frequente = resposta %in% c(4, 5),
    
    GRUPO_VITIMIZACAO = factor(
      GRUPO_VITIMIZACAO,
      levels = c(
        "Não relatou vitimização",
        "Relatou vitimização"
      )
    )
  )

# 3. Calcular as frequências e os percentuais ponderados
resumo <- dados_longos %>%
  group_by(GRUPO_VITIMIZACAO, indicador) %>%
  summarise(
    n_total = n(),
    n_frequente = sum(indicador_frequente),
    peso_total = sum(PESO_ALUNO_FREQ),
    peso_frequente = sum(
      PESO_ALUNO_FREQ[indicador_frequente]
    ),
    percentual_ponderado =
      100 * peso_frequente / peso_total,
    .groups = "drop"
  ) %>%
  mutate(
    rotulo = paste0(
      "n = ", formatar_numero(n_frequente),
      "\n",
      formatC(
        percentual_ponderado,
        format = "f",
        digits = 1,
        decimal.mark = ","
      ),
      "%"
    )
  )

# 4. Construir o gráfico
grafico_saude <- ggplot(
  resumo,
  aes(
    x = n_frequente,
    y = indicador,
    fill = GRUPO_VITIMIZACAO
  )
) +
  geom_col(
    position = position_dodge(width = 0.82),
    width = 0.72
  ) +
  geom_text(
    aes(label = rotulo),
    position = position_dodge(width = 0.82),
    hjust = -0.08,
    size = 3
  ) +
  scale_fill_manual(
    values = c(
      "Não relatou vitimização" = "#B8B8B8",
      "Relatou vitimização" = "#D95F59"
    )
  ) +
  scale_x_continuous(
    labels = formatar_numero,
    expand = expansion(mult = c(0, 0.42))
  ) +
  labs(
    title = "Bullying e indicadores emocionais associados",
    subtitle = paste(
      "Comparação de indicadores emocionais autorreferidos",
      "entre estudantes com e sem relato de vitimização"
    ),
    x = "Número de estudantes que relataram o indicador frequentemente",
    y = "Indicador emocional e possível associação clínica",
    fill = "Relato de vitimização"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    axis.text.y = element_text(size = 10),
    panel.grid.major.y = element_blank(),
    legend.position = "bottom"
  )

print(grafico_saude)

# 5. Exibir a tabela com os valores utilizados
print(
  resumo %>%
    select(
      indicador,
      GRUPO_VITIMIZACAO,
      n_frequente,
      percentual_ponderado
    )
)