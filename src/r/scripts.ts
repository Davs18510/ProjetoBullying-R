import type { TopicId } from '../state/useStory'

export interface RTask {
  /** R script name displayed in the IDE header. */
  displayName: string
  /** CSV files (inside public/data) that must be mounted before running. */
  dataFiles: string[]
  /** CRAN/WebR packages required by the script. */
  packages: string[]
  /** Executable R code. */
  code: string
}

const PENSe_10000 = 'PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv'
const TIC_G22B = 'TIC_Kids_Online_Brasil_2024_G22B.csv'
const PENSe_SAUDE = 'PeNSE2024_saude_mental_amostra_web.csv'
const PENSe_CONDENSADA = 'PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv'

export const R_TASKS: Partial<Record<TopicId, RTask>> = {
  mapeamento: {
    displayName: 'Projeto_bullying.R',
    dataFiles: [PENSe_10000],
    packages: ['ggplot2'],
    code: `# Tópico 02 - Mapeamento do bullying nas escolas
library(ggplot2)

dados <- read.csv(
  "PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv",
  fileEncoding = "UTF-8-BOM"
)

formatar_eixo <- function(x) {
  format(
    x,
    big.mark = ".",
    decimal.mark = ",",
    scientific = FALSE,
    trim = TRUE
  )
}

tema_barras <- theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom",
    legend.title = element_text(face = "bold")
  )

# 1. Distribuição por faixa etária
p_idade <- ggplot(
  dados,
  aes(x = MODALIDADE_BULLYING_SOFRIDO, fill = MODALIDADE_BULLYING_SOFRIDO)
) +
  geom_bar() +
  facet_wrap(~FAIXA_ETARIA) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(labels = formatar_eixo) +
  tema_barras +
  labs(
    title = "Distribuição do bullying e cyberbullying por idade",
    x = NULL,
    y = "Registros de estudantes",
    fill = "Modalidade de bullying"
  )

print(p_idade)

# 2. Distribuição por sexo
p_sexo <- ggplot(
  dados,
  aes(x = MODALIDADE_BULLYING_SOFRIDO, fill = MODALIDADE_BULLYING_SOFRIDO)
) +
  geom_bar() +
  facet_wrap(~SEXO) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(labels = formatar_eixo) +
  tema_barras +
  labs(
    title = "Distribuição do bullying por sexo",
    x = NULL,
    y = "Registros de estudantes",
    fill = "Modalidade de bullying"
  )

print(p_sexo)

# 3. Distribuição por tipo de escola
p_escola <- ggplot(
  dados,
  aes(x = MODALIDADE_BULLYING_SOFRIDO, fill = MODALIDADE_BULLYING_SOFRIDO)
) +
  geom_bar() +
  facet_wrap(~REDE_ESCOLAR) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(labels = formatar_eixo) +
  tema_barras +
  labs(
    title = "Distribuição do bullying por tipo de escola",
    x = NULL,
    y = "Registros de estudantes",
    fill = "Modalidade de bullying"
  )

print(p_escola)

# 4. Distribuição por localização (município/referência geográfica)
p_localidade <- ggplot(
  dados,
  aes(x = MODALIDADE_BULLYING_SOFRIDO, fill = MODALIDADE_BULLYING_SOFRIDO)
) +
  geom_bar() +
  facet_wrap(~TIPO_LOCALIDADE) +
  scale_fill_brewer(palette = "Set2") +
  scale_y_continuous(labels = formatar_eixo) +
  tema_barras +
  theme(strip.text = element_text(size = 8)) +
  labs(
    title = "Distribuição do bullying por referência geográfica",
    x = NULL,
    y = "Registros de estudantes",
    fill = "Modalidade de bullying"
  )

print(p_localidade)
`,
  },

  pratica: {
    displayName: 'Projeto_bullying.R',
    dataFiles: [PENSe_10000],
    packages: ['ggplot2'],
    code: `# Tópico 03 - A prática do bullying
library(ggplot2)

dados <- read.csv(
  "PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv",
  fileEncoding = "UTF-8-BOM"
)

formatar_eixo <- function(x) {
  format(
    x,
    big.mark = ".",
    decimal.mark = ",",
    scientific = FALSE,
    trim = TRUE
  )
}

# Mantém somente estudantes classificados como agressores
dados_agressores <- subset(
  dados,
  !is.na(MODALIDADE_BULLYING_PRATICADO) &
    MODALIDADE_BULLYING_PRATICADO != "Nenhuma modalidade relatada" &
    MODALIDADE_BULLYING_PRATICADO != "Não informado/dados insuficientes"
)

# Função para gerar o perfil dos agressores por categoria
grafico_perfil <- function(variavel, rotulo_x, titulo) {
  tabela <- as.data.frame(table(dados_agressores[[variavel]]))
  names(tabela) <- c("categoria", "frequencia")
  tabela <- subset(tabela, frequencia > 0)

  ggplot(
    tabela,
    aes(x = reorder(categoria, -frequencia), y = frequencia, fill = categoria)
  ) +
    geom_col(color = "black", linewidth = 0.3) +
    scale_y_continuous(labels = formatar_eixo) +
    labs(
      title = titulo,
      x = rotulo_x,
      y = "Estudantes classificados como agressores"
    ) +
    theme_minimal() +
    theme(
      legend.position = "none",
      axis.text.x = element_text(angle = 25, hjust = 1),
      plot.title = element_text(face = "bold", size = 11)
    )
}

# 1. Perfil do agressor por faixa etária
p_agressor_idade <- grafico_perfil(
  "FAIXA_ETARIA",
  "Faixa etária",
  "Frequência de agressores por faixa etária"
)

print(p_agressor_idade)

# 2. Perfil do agressor por sexo
p_agressor_sexo <- grafico_perfil(
  "SEXO",
  "Sexo",
  "Frequência de agressores por sexo"
)

print(p_agressor_sexo)

# 3. Perfil do agressor por tipo de escola
p_agressor_escola <- grafico_perfil(
  "REDE_ESCOLAR",
  "Rede escolar",
  "Frequência de agressores por rede escolar"
)

print(p_agressor_escola)

# 4. Perfil do agressor por localização (município/referência geográfica)
p_agressor_localidade <- grafico_perfil(
  "TIPO_LOCALIDADE",
  "Referência geográfica",
  "Frequência de agressores por referência geográfica"
)

print(p_agressor_localidade)

# 5. Tipos de agressão mais praticados
tipos <- subset(
  dados,
  TIPOS_AGRESSAO_PRATICADA != "Nenhum tipo relatado" &
    TIPOS_AGRESSAO_PRATICADA != "Dados insuficientes" &
    !grepl(";", TIPOS_AGRESSAO_PRATICADA)
)

tab <- as.data.frame(table(tipos$TIPOS_AGRESSAO_PRATICADA))
names(tab) <- c("Tipo", "Frequencia")
tab <- head(tab[order(-tab$Frequencia), ], 5)

p_tipos <- ggplot(tab, aes(x = reorder(Tipo, Frequencia), y = Frequencia)) +
  geom_col(fill = "#5B8FF9", width = 0.7) +
  scale_y_continuous(labels = formatar_eixo) +
  coord_flip() +
  theme_minimal() +
  labs(
    title = "Os tipos de agressão mais praticados",
    subtitle = "Frequência dos registros na base PeNSE 2024",
    x = "Tipo de agressão",
    y = "Frequência de registros"
  )

print(p_tipos)
`,
  },

  denuncias: {
    displayName: 'grafico_canais_denuncia_G22B.R',
    dataFiles: [TIC_G22B, PENSe_CONDENSADA],
    packages: ['ggplot2'],
    code: `# Tópico 04 - Padrões das denúncias e métodos de intervenção
# TIC Kids Online Brasil 2024 (tabela G22B) e PeNSE 2024
library(ggplot2)

formatar_eixo <- function(x) {
  format(
    round(x),
    big.mark = ".",
    decimal.mark = ",",
    scientific = FALSE,
    trim = TRUE
  )
}

# ============================================================
# 1. CANAIS DE DENÚNCIA (TIC Kids Online Brasil 2024 - G22B)
# ============================================================

dados <- read.csv(
  "TIC_Kids_Online_Brasil_2024_G22B.csv",
  sep = ";",
  fileEncoding = "UTF-8-BOM"
)

freq <- subset(
  dados,
  recorte == "TOTAL" &
    categoria == "Total" &
    resposta == "Sim" &
    canal_resposta != "Não falou para ninguém"
)

freq$canal_resposta <- factor(
  freq$canal_resposta,
  levels = freq$canal_resposta[order(freq$frequencia_pessoas)]
)

p_canais <- ggplot(freq, aes(x = canal_resposta, y = frequencia_pessoas)) +
  geom_col(fill = "#377EB8", width = 0.72) +
  coord_flip() +
  scale_y_continuous(labels = formatar_eixo) +
  theme_minimal() +
  labs(
    title = "A quem contaram sobre situações ofensivas na internet",
    subtitle = "TIC Kids Online Brasil 2024 - usuários de 11 a 17 anos",
    x = "Pessoa a quem contaram",
    y = "Frequência estimada de pessoas"
  )

print(p_canais)

# ============================================================
# 2. MÉTODOS DE INTERVENÇÃO (PeNSE 2024)
# ============================================================

base_prevencao <- read.csv(
  "PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv",
  fileEncoding = "UTF-8-BOM"
)

# Indicador de ocorrência de vitimização
vitimizacao <- (base_prevencao$B07007B %in% 2:4) |
  (base_prevencao$B07011A %in% 2:4) |
  (base_prevencao$B07012A %in% 2:4) |
  (base_prevencao$B07013 == 1)

vitimizacao[is.na(vitimizacao)] <- FALSE

metodos <- c(
  E01P117 = "Suporte psicológico para bullying ou violência",
  E01P11801 = "Profissional de saúde mental da escola",
  E01P11802 = "Profissional de saúde mental terceirizado",
  E01P11803 = "Apoio de UBS, equipe de saúde ou CAPS",
  E01P11804 = "Apoio escolar sem profissional de saúde",
  E01P11805 = "Outro suporte/estrutura psicológica"
)

# Recodifica cada método em Sim (1) e Não (0)
acoes <- lapply(names(metodos), function(var) {
  if (var == "E01P117") {
    ifelse(
      base_prevencao$E01P117 %in% 1:3, 1L,
      ifelse(base_prevencao$E01P117 == 4, 0L, NA_integer_)
    )
  } else {
    valores <- base_prevencao[[var]]
    ifelse(
      valores == 1, 1L,
      ifelse(valores == 0 | base_prevencao$E01P117 == 4, 0L, NA_integer_)
    )
  }
})

resumo_metodos <- do.call(rbind, lapply(seq_along(metodos), function(i) {
  acao <- acoes[[i]]
  valido <- !is.na(acao)
  data.frame(
    metodo = metodos[[i]],
    acao = c("Sim", "Não"),
    n_vitimas = c(
      sum(vitimizacao[valido] & acao[valido] == 1),
      sum(vitimizacao[valido] & acao[valido] == 0)
    ),
    n_estudantes = c(
      sum(acao[valido] == 1),
      sum(acao[valido] == 0)
    )
  )
}))

ordem <- resumo_metodos$metodo[resumo_metodos$acao == "Sim"]
ordem <- ordem[order(resumo_metodos$n_vitimas[resumo_metodos$acao == "Sim"])]

resumo_metodos$metodo <- factor(resumo_metodos$metodo, levels = ordem)
resumo_metodos$acao <- factor(resumo_metodos$acao, levels = c("Sim", "Não"))

p_metodos <- ggplot(
  resumo_metodos,
  aes(x = metodo, y = n_vitimas, fill = acao)
) +
  geom_col(position = position_dodge(width = 0.82), width = 0.72) +
  geom_text(
    aes(label = formatar_eixo(n_vitimas)),
    position = position_dodge(width = 0.82),
    hjust = -0.08,
    size = 3
  ) +
  coord_flip() +
  scale_fill_manual(
    values = c("Sim" = "#277DA1", "Não" = "#B8B8B8")
  ) +
  scale_y_continuous(
    labels = formatar_eixo,
    expand = expansion(mult = c(0, 0.25))
  ) +
  theme_minimal() +
  labs(
    title = "Vitimização segundo o suporte disponível na escola",
    x = "Ação ou tipo de suporte informado pela escola",
    y = "Número de estudantes que relataram vitimização",
    fill = "A escola informou o suporte?"
  )

print(p_metodos)
`,
  },

  saude: {
    displayName: 'Projeto_bullying2.R',
    dataFiles: [PENSe_SAUDE],
    packages: ['ggplot2'],
    code: `# Tópico 05 - Bullying e indicadores emocionais
library(ggplot2)

dados <- read.csv(
  "PeNSE2024_saude_mental_amostra_web.csv",
  fileEncoding = "UTF-8-BOM"
)

vitimizacao <- (dados$B07007B %in% 2:4) |
  (dados$B07011A %in% 2:4) |
  (dados$B07012A %in% 2:4) |
  (dados$B07013 == 1)

dados$grupo <- ifelse(
  vitimizacao,
  "Relatou vitimização",
  "Não relatou vitimização"
)

indicadores <- c(
  B12004 = "Ansiedade (preocupação)",
  B12005 = "Humor depressivo (tristeza)",
  B12006 = "Falta de apoio percebida",
  B12007 = "Irritabilidade/nervosismo"
)

resumo <- do.call(rbind, lapply(names(indicadores), function(v) {
  frequente <- dados[[v]] %in% 4:5
  medias <- tapply(frequente, dados$grupo, mean) * 100
  data.frame(
    indicador = indicadores[[v]],
    grupo = names(medias),
    percentual = as.numeric(medias)
  )
}))

resumo$grupo <- factor(
  resumo$grupo,
  levels = c("Não relatou vitimização", "Relatou vitimização")
)

p <- ggplot(resumo, aes(x = indicador, y = percentual, fill = grupo)) +
  geom_col(position = "dodge", width = 0.7) +
  coord_flip() +
  scale_fill_manual(
    values = c(
      "Não relatou vitimização" = "#B8B8B8",
      "Relatou vitimização" = "#D95F59"
    )
  ) +
  theme_minimal() +
  labs(
    title = "Indicadores emocionais segundo vitimização",
    x = NULL,
    y = "% de respostas frequentes",
    fill = NULL
  )

print(p)
`,
  },
}
