# ============================================================
# Gráfico — destinatários das revelações de situações ofensivas
# na internet (TIC Kids Online Brasil 2024, tabela G22B)
# ============================================================

library(readr)
library(dplyr)
library(ggplot2)

# A base CSV foi exportada em formato longo e usa ponto e vírgula.
dados_g22b <- read_delim(
  "TIC_Kids_Online_Brasil_2024_G22B.csv",
  delim = ";",
  na = c("", "NA"),
  show_col_types = FALSE
)

# Usar somente a linha TOTAL / Total e as respostas "Sim".
# A coluna frequencia_pessoas contém os totais estimados apresentados
# na tabela do Cetic.br/NIC.br; não são contagens brutas de respondentes.
frequencias <- dados_g22b %>%
  filter(
    recorte == "TOTAL",
    categoria == "Total",
    resposta == "Sim",
    !is.na(frequencia_pessoas),
    canal_resposta != "Não falou para ninguém"
  ) %>%
  mutate(
    frequencia_pessoas = as.numeric(frequencia_pessoas),
    canal_resposta = trimws(canal_resposta),
    canal_resposta = factor(
      canal_resposta,
      levels = canal_resposta[order(frequencia_pessoas)]
    )
  )

# Gráfico de barras horizontais ordenadas
grafico_canais <- ggplot(
  frequencias,
  aes(x = canal_resposta, y = frequencia_pessoas)
) +
  geom_col(fill = "#377EB8", width = 0.72) +
  geom_text(
    aes(label = format(
      round(frequencia_pessoas),
      big.mark = ".",
      decimal.mark = ",",
      scientific = FALSE,
      trim = TRUE
    )),
    hjust = -0.12,
    size = 3.8
  ) +
  coord_flip() +
  scale_y_continuous(
    labels = function(x) format(
      round(x), big.mark = ".", decimal.mark = ",",
      scientific = FALSE, trim = TRUE
    ),
    expand = expansion(mult = c(0, 0.16))
  ) +
  labs(
    title = "A quem crianças e adolescentes contaram sobre situações ofensivas na internet",
    subtitle = "TIC Kids Online Brasil 2024 — tabela G22B; usuários de internet de 11 a 17 anos",
    x = "Pessoa a quem contaram",
    y = "Frequência estimada de pessoas",
    caption = paste(
      "A categoria ‘Não falou para ninguém’ foi excluída por não ser um canal de revelação.",
      "A tabela trata de situações ofensivas na internet, não exclusivamente de bullying/cyberbullying."
    )
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    plot.subtitle = element_text(size = 10),
    panel.grid.major.y = element_blank(),
    plot.caption = element_text(size = 8, hjust = 0)
  )

print(grafico_canais)

# Tabela numérica utilizada no gráfico
print(frequencias %>% select(canal_resposta, frequencia_pessoas))

# Para incluir também quem não contou a ninguém, remova esta condição do filtro:
# canal_resposta != "Não falou para ninguém"
