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

p <- ggplot(
  dados,
  aes(x = MODALIDADE_BULLYING_SOFRIDO, fill = MODALIDADE_BULLYING_SOFRIDO)
) +
  geom_bar() +
  facet_wrap(~FAIXA_ETARIA) +
  scale_fill_brewer(palette = "Set2") +
  theme_minimal() +
  theme(
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    legend.position = "bottom"
  ) +
  labs(
    title = "Distribuição do bullying e cyberbullying por idade",
    x = NULL,
    y = "Registros de estudantes",
    fill = "Modalidade de bullying"
  )

print(p)
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

tipos <- subset(
  dados,
  TIPOS_AGRESSAO_PRATICADA != "Nenhum tipo relatado" &
    TIPOS_AGRESSAO_PRATICADA != "Dados insuficientes" &
    !grepl(";", TIPOS_AGRESSAO_PRATICADA)
)

tab <- as.data.frame(table(tipos$TIPOS_AGRESSAO_PRATICADA))
names(tab) <- c("Tipo", "Frequencia")
tab <- head(tab[order(-tab$Frequencia), ], 5)

p <- ggplot(tab, aes(x = reorder(Tipo, Frequencia), y = Frequencia)) +
  geom_col(fill = "#5B8FF9", width = 0.7) +
  coord_flip() +
  theme_minimal() +
  labs(
    title = "Os tipos de agressão mais praticados",
    subtitle = "Frequência dos registros na base PeNSE 2024",
    x = "Tipo de agressão",
    y = "Frequência de registros"
  )

print(p)
`,
  },

  denuncias: {
    displayName: 'grafico_canais_denuncia_G22B.R',
    dataFiles: [TIC_G22B],
    packages: ['ggplot2'],
    code: `# Tópico 04 - Padrões das denúncias
# TIC Kids Online Brasil 2024 - tabela G22B
library(ggplot2)

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

p <- ggplot(freq, aes(x = canal_resposta, y = frequencia_pessoas)) +
  geom_col(fill = "#377EB8", width = 0.72) +
  coord_flip() +
  theme_minimal() +
  labs(
    title = "A quem contaram sobre situações ofensivas na internet",
    subtitle = "TIC Kids Online Brasil 2024 - usuários de 11 a 17 anos",
    x = "Pessoa a quem contaram",
    y = "Frequência estimada de pessoas"
  )

print(p)
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
