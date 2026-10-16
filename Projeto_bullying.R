library(ggplot2)
library(tidyverse)
library(lubridate)
data_base <- read_csv('PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv')


library(dplyr)
library(ggplot2)


scale_y_continuous(
  labels = function(x) {
    format(
      x,
      big.mark = ".",
      decimal.mark = ",",
      scientific = FALSE,
      trim = TRUE
    )
  }
)

# ============================================================
# 1. BULLYING POR FAIXA ETÁRIA
# ============================================================

resumo_graf1 <- data_base %>%
  count(
    FAIXA_ETARIA,
    MODALIDADE_BULLYING_SOFRIDO,
    name = "quantidade"
  )

graf_1 <- ggplot(
  resumo_graf1,
  aes(
    x = MODALIDADE_BULLYING_SOFRIDO,
    y = quantidade,
    fill = MODALIDADE_BULLYING_SOFRIDO
  )
) +
  geom_col(color = "black", linewidth = 0.3) +
  facet_wrap(~FAIXA_ETARIA) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(
    labels = scales::label_number(
      big.mark = ".",
      decimal.mark = ","
    )
  ) +
  labs(
    title = "Distribuição do bullying e cyberbullying por idade",
    x = NULL,
    y = "Número de registros de estudantes",
    fill = "Modalidade de bullying"
  ) +
  theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom",
    legend.title = element_text(face = "bold")
  )

print(graf_1)


# ============================================================
# 2. BULLYING POR GÊNERO
# ============================================================

resumo_genero <- data_base %>%
  count(
    SEXO,
    MODALIDADE_BULLYING_SOFRIDO,
    name = "quantidade"
  )

graf_genero <- ggplot(
  resumo_genero,
  aes(
    x = MODALIDADE_BULLYING_SOFRIDO,
    y = quantidade,
    fill = MODALIDADE_BULLYING_SOFRIDO
  )
) +
  geom_col(color = "black", linewidth = 0.3) +
  facet_wrap(~SEXO) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(
    labels = scales::label_number(
      big.mark = ".",
      decimal.mark = ","
    )
  ) +
  labs(
    title = "Distribuição do bullying por gênero",
    x = NULL,
    y = "Número de registros de estudantes",
    fill = "Modalidade de bullying"
  ) +
  theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom",
    legend.title = element_text(face = "bold")
  )

print(graf_genero)


# ============================================================
# 3. BULLYING POR TIPO DE ESCOLA
# ============================================================

resumo_escola <- data_base %>%
  count(
    REDE_ESCOLAR,
    MODALIDADE_BULLYING_SOFRIDO,
    name = "quantidade"
  )

graf_escola <- ggplot(
  resumo_escola,
  aes(
    x = MODALIDADE_BULLYING_SOFRIDO,
    y = quantidade,
    fill = MODALIDADE_BULLYING_SOFRIDO
  )
) +
  geom_col(color = "black", linewidth = 0.3) +
  facet_wrap(~REDE_ESCOLAR) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(
    labels = scales::label_number(
      big.mark = ".",
      decimal.mark = ","
    )
  ) +
  labs(
    title = "Distribuição do bullying por tipo de escola",
    x = NULL,
    y = "Número de registros de estudantes",
    fill = "Modalidade de bullying"
  ) +
  theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom",
    legend.title = element_text(face = "bold")
  )

print(graf_escola)


# ============================================================
# 4. BULLYING POR REFERÊNCIA GEOGRÁFICA
# ============================================================

resumo_municipio <- data_base %>%
  count(
    TIPO_LOCALIDADE,
    MODALIDADE_BULLYING_SOFRIDO,
    name = "quantidade"
  )

graf_municipio <- ggplot(
  resumo_municipio,
  aes(
    x = MODALIDADE_BULLYING_SOFRIDO,
    y = quantidade,
    fill = MODALIDADE_BULLYING_SOFRIDO
  )
) +
  geom_col(color = "black", linewidth = 0.3) +
  facet_wrap(~TIPO_LOCALIDADE) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(
    labels = scales::label_number(
      big.mark = ".",
      decimal.mark = ","
    )
  ) +
  labs(
    title = "Distribuição do bullying por referência geográfica",
    x = NULL,
    y = "Número de registros de estudantes",
    fill = "Modalidade de bullying"
  ) +
  theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom",
    legend.title = element_text(face = "bold"),
    strip.text = element_text(size = 8)
  )

print(graf_municipio)
#==========================================
#==========================================
# OBJETIVO 2 - Agressão               =====
#==========================================
#==========================================

# Formatação dos números no padrão brasileiro
formatar_eixo <- function(x) {
  format(
    x,
    big.mark = ".",
    decimal.mark = ",",
    scientific = FALSE,
    trim = TRUE
  )
}

# Filtrar estudantes classificados como agressores
dados_agressores <- data_base %>%
  filter(
    !is.na(MODALIDADE_BULLYING_PRATICADO),
    !(
      tolower(trimws(as.character(MODALIDADE_BULLYING_PRATICADO))) %in%
        c("nenhuma", "não praticou bullying", "nao praticou bullying")
    )
  )

# Função para gerar gráficos de frequência por perfil
grafico_frequencia <- function(dados, variavel, nome_perfil, titulo) {
  
  resumo <- dados %>%
    group_by(across(all_of(variavel))) %>%
    summarise(frequencia = n(), .groups = "drop")
  
  ggplot(
    resumo,
    aes(
      x = .data[[variavel]],
      y = frequencia,
      fill = .data[[variavel]]
    )
  ) +
    geom_col(color = "black", linewidth = 0.3) +
    scale_y_continuous(labels = formatar_eixo) +
    labs(
      title = titulo,
      x = nome_perfil,
      y = "Número de estudantes classificados como agressores"
    ) +
    theme_minimal() +
    theme(
      legend.position = "none",
      axis.text.x = element_text(angle = 25, hjust = 1),
      plot.title = element_text(face = "bold")
    )
}

# 1. Frequência por faixa etária
graf_agressor_idade <- grafico_frequencia(
  dados_agressores,
  "FAIXA_ETARIA",
  "Faixa etária",
  "Frequência de agressores por faixa etária"
)
print(graf_agressor_idade)

# 2. Frequência por sexo
graf_agressor_sexo <- grafico_frequencia(
  dados_agressores,
  "SEXO",
  "Sexo",
  "Frequência de agressores por sexo"
)
print(graf_agressor_sexo)

# 3. Frequência por rede escolar
graf_agressor_escola <- grafico_frequencia(
  dados_agressores,
  "REDE_ESCOLAR",
  "Rede escolar",
  "Frequência de agressores por rede escolar"
)
print(graf_agressor_escola)

# 4. Frequência por referência geográfica
graf_agressor_localidade <- grafico_frequencia(
  dados_agressores,
  "TIPO_LOCALIDADE",
  "Referência geográfica",
  "Frequência de agressores por referência geográfica"
)
print(graf_agressor_localidade)


#===========================
# Tipos de agressão 
#===========================

# 1. Preparar os dados
dados_agressoes <- data_base %>%
  select(TIPOS_AGRESSAO_PRATICADA) %>%
  filter(!str_detect(TIPOS_AGRESSAO_PRATICADA, ";"), TIPOS_AGRESSAO_PRATICADA != "Nenhum tipo relatado" & TIPOS_AGRESSAO_PRATICADA != "Dados insuficientes" ) %>%
  mutate(
    TIPOS_AGRESSAO_PRATICADA =
      trimws(as.character(TIPOS_AGRESSAO_PRATICADA))
  ) 

# 2. Calcular a frequência de cada tipo de agressão
frequencia_agressoes <- dados_agressoes %>%
  count(
    TIPOS_AGRESSAO_PRATICADA,
    name = "frequencia"
  ) %>%
  arrange(desc(frequencia)) %>%
  slice_head(n = 3)

# 3. Criar o gráfico das cinco agressões mais frequentes
grafico_top5_agressoes <- ggplot(
  frequencia_agressoes,
  aes(
    x = reorder(TIPOS_AGRESSAO_PRATICADA, frequencia),
    y = frequencia
  )
) +
  geom_col(
    fill = "#5B8FF9",
    color = "black",
    linewidth = 0.3,
    width = 0.7
  ) +
  geom_text(
    aes(
      label = format(
        frequencia,
        big.mark = ".",
        decimal.mark = ",",
        scientific = FALSE
      )
    ),
    hjust = -0.15,
    size = 4
  ) +
  coord_flip() +
  scale_y_continuous(
    labels = function(x) {
      format(
        x,
        big.mark = ".",
        decimal.mark = ",",
        scientific = FALSE
      )
    },
    expand = expansion(mult = c(0, 0.15))
  ) +
  labs(
    title = "Os tipos de agressão mais praticados",
    subtitle = "Frequência dos registros na base PeNSE 2024",
    x = "Tipo de agressão",
    y = "Frequência de registros"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold", size = 15),
    plot.subtitle = element_text(size = 10),
    axis.text.y = element_text(size = 10),
    panel.grid.major.y = element_blank()
  )

# 4. Exibir o gráfico e a tabela de frequências
print(grafico_top5_agressoes)
print(frequencia_agressoes)