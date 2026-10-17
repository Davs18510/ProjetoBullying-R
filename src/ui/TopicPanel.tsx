import { useEffect, useCallback } from 'react'
import { useStory, TOPIC_ORDER, type TopicId } from '../state/useStory'
import { getTopicById } from '../content/topics'
import { StoryNav } from './StoryNav'

function CvvNote() {
  return (
    <div
      role="note"
      aria-label="Aviso de apoio à saúde mental"
      style={{
        marginTop: 14,
        padding: '12px 16px',
        borderRadius: 14,
        background: 'rgba(217,119,36,0.12)',
        border: '1px solid rgba(255,190,89,0.4)',
        fontSize: '0.82rem',
        color: 'var(--text-soft)',
        lineHeight: 1.55,
      }}
    >
      💙{' '}
      <em>
        Se você ou alguém que você conhece está passando por sofrimento, o{' '}
        <strong style={{ color: 'var(--golden-deep)' }}>CVV</strong> (188, ligação
        gratuita, 24h) pode ajudar.
      </em>
    </div>
  )
}

// Default R code preview per topic
const TOPIC_R_SCRIPTS: Record<TopicId, { name: string; code: string }> = {
  intro: {
    name: 'metodologia_pense.R',
    code: `# Metodologia PeNSE 2024 & Amostra
library(dplyr)
library(ggplot2)

dados <- read.csv("PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv")

# Sumarização da amostra representativa
cat("Total de observações carregadas:", nrow(dados), "\\n")
cat("Variáveis disponíveis:", paste(names(dados)[1:5], collapse=", "), "...\\n")

ggplot(dados, aes(x = factor(LOCALIDADE))) +
  geom_bar(fill = "#d97724", alpha = 0.85) +
  theme_minimal() +
  labs(title = "Distribuição da Amostra por Região", x = "Localidade", y = "Amostra")
`,
  },
  mapeamento: {
    name: 'Projeto_bullying.R',
    code: `# Tópico 02: Mapeamento do bullying nas escolas
library(ggplot2)
library(dplyr)

dados <- read.csv("PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv")

# Análise de proporção por modalidade e rede escolar
ggplot(dados, aes(x = MODALIDADE, fill = BULLYING)) +
  geom_bar(position = "fill") +
  scale_fill_manual(values = c("#f59e0b", "#d97724", "#0891b2")) +
  theme_minimal() +
  labs(title = "Prevalência de Bullying por Modalidade", y = "Proporção", x = "Modalidade")
`,
  },
  pratica: {
    name: 'Projeto_bullying.R',
    code: `# Tópico 03: A prática do bullying e frequência
library(ggplot2)
library(dplyr)

dados <- read.csv("PeNSE2024_bullying_base_categorica_modalidade_localidade_10000.csv")

# Frequência de ocorrência e reincidência
ggplot(dados, aes(x = FREQUENCIA_BULLYING)) +
  geom_histogram(stat = "count", fill = "#d97724", color = "#ffeed4") +
  theme_minimal() +
  labs(title = "Frequência Relatada pelos Estudantes", x = "Frequência", y = "Casos")
`,
  },
  denuncias: {
    name: 'grafico_canais_denuncia_G22B.R',
    code: `# Tópico 04: Padrões de denúncias e canais de intervenção
library(ggplot2)
library(dplyr)

dados_denuncia <- read.csv("TIC_Kids_Online_Brasil_2024_G22B.csv")

# Eficácia e busca de canais formais e informais
ggplot(dados_denuncia, aes(x = reorder(CANAL, CASOS), y = CASOS)) +
  geom_col(fill = "#e07a5f", width = 0.65) +
  coord_flip() +
  theme_minimal() +
  labs(title = "Canais de Denúncia Mais Utilizados", x = "Canal", y = "Total de Registros")
`,
  },
  saude: {
    name: 'Projeto_bullying2.R',
    code: `# Tópico 05: Bullying e impactos na Saúde Mental
library(ggplot2)
library(dplyr)

dados_saude <- read.csv("PeNSE2024_base_bullying_saude_mental_prevencao_condensada.csv")

# Correlação entre vitimização e sintomas de ansiedade/depressão
ggplot(dados_saude, aes(x = NIVEL_BULLYING, y = INDICE_SAUDE_MENTAL)) +
  geom_boxplot(fill = "#ffeed4", color = "#d97724") +
  theme_minimal() +
  labs(title = "Impacto do Bullying no Bem-Estar Psicológico", x = "Exposição", y = "Índice de Sofrimento")
`,
  },
  solucoes: {
    name: 'propostas_intervencao.R',
    code: `# Tópico 06: Soluções e intervenções baseadas em dados
library(ggplot2)
library(dplyr)

# Modelagem de cenários de redução com apoio psicossocial
cenarios <- data.frame(
  Estrategia = c("Status Quo", "Canais Anônimos", "Apoio Emocional", "Programa Integrado"),
  Eficacia_Estimada = c(0, 18.5, 27.2, 44.8)
)

ggplot(cenarios, aes(x = reorder(Estrategia, Eficacia_Estimada), y = Eficacia_Estimada)) +
  geom_col(fill = "#16a34a", width = 0.6) +
  geom_text(aes(label = paste0(Eficacia_Estimada, "%")), hjust = -0.2, fontface = "bold") +
  coord_flip() +
  ylim(0, 55) +
  theme_minimal() +
  labs(title = "Eficácia Projetada das Intervenções", x = "Estratégia", y = "Redução Estimada (%)")
`,
  },
}

export function TopicPanel() {
  const view = useStory((s) => s.view)
  const close = useStory((s) => s.close)
  const next = useStory((s) => s.next)
  const prev = useStory((s) => s.prev)

  const isOpen = view !== 'hub'
  const topicId = (isOpen ? view : 'intro') as TopicId
  const topic = isOpen ? getTopicById(topicId) : undefined
  const rScript = TOPIC_R_SCRIPTS[topicId]

  const currentIndex = isOpen ? TOPIC_ORDER.indexOf(topicId) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < TOPIC_ORDER.length - 1

  // Keyboard shortcuts
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    },
    [isOpen, close, next, prev]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div
      aria-hidden={!isOpen}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(26, 37, 54, 0.35)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Sliding Glass Panel */}
      <div
        role="dialog"
        aria-label={topic?.title ?? 'Painel de Análise R'}
        className="glass"
        style={{
          position: 'relative',
          width: 'min(760px, 94vw)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(105%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-8px 0 36px rgba(217, 119, 36, 0.22)',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.45)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ flex: 1 }}>
            {/* Number badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '3px 12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffc46b, #d97724)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(217,119,36,0.35)',
              }}
            >
              TÓPICO {topic?.number}
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {topic?.title}
            </h2>

            {/* Presenter badge */}
            <div
              style={{
                marginTop: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffbe59, #b85d19)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {topic?.presenter?.charAt(0)}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-soft)',
                  fontWeight: 600,
                }}
              >
                Apresentação: {topic?.presenter}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            aria-label="Fechar e voltar ao hub"
            onClick={close}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: 'var(--text)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ✕
          </button>
        </div>

        {/* ── EXCLUSIVE R INTERACTIVE IDE CONTAINER ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* IDE Action Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
                📜 {rScript?.name}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#16a34a',
                  background: 'rgba(34, 197, 94, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                ● WebR Ativo
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="btn-golden"
                style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                onClick={() => {
                  alert('Execução com WebR em tempo real será ativada na Fase 3!')
                }}
              >
                ▶ Executar Código
              </button>
            </div>
          </div>

          {/* R Code Editor Area */}
          <div
            style={{
              borderRadius: 16,
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                background: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                fontSize: '0.75rem',
              }}
            >
              <span>Editor R (Modo Interativo)</span>
              <span>Atalho: Ctrl + Enter para executar</span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '14px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: '#f8fafc',
                overflowX: 'auto',
                maxHeight: '190px',
              }}
            >
              <code>{rScript?.code}</code>
            </pre>
          </div>

          {/* Graphical Output / Plot Canvas Viewport */}
          <div
            style={{
              flex: 1,
              minHeight: '220px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.4)',
                borderBottom: '1px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text)',
              }}
            >
              <span>📊 Dispositivo Gráfico WebR (Canvas 800 × 500)</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-soft)' }}>
                Renderização R direta
              </span>
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                gap: 10,
                textAlign: 'center',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(254,243,199,0.3) 100%)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffc46b, #d97724)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  boxShadow: '0 8px 20px rgba(217,119,36,0.25)',
                }}
              >
                📈
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                Ambiente Estatístico R Pronto
              </p>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.8rem', maxWidth: 360 }}>
                O gráfico deste tópico será renderizado em tempo real via WebAssembly na Fase 3.
                Qualquer modificação no código R acima atualizará a imagem instantaneamente.
              </p>
            </div>
          </div>

          {topic?.cvvNote && <CvvNote />}
        </div>

        {/* Footer navigation */}
        <div
          style={{
            padding: '14px 28px',
            borderTop: '1px solid rgba(255,255,255,0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255,255,255,0.3)',
          }}
        >
          <button
            aria-label="Tópico anterior"
            className="btn-golden"
            onClick={prev}
            disabled={!hasPrev}
            style={{ opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? 'pointer' : 'not-allowed', padding: '8px 18px' }}
          >
            ← Anterior
          </button>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {isOpen && <StoryNav currentId={topicId} />}
          </div>

          <button
            aria-label="Próximo tópico"
            className="btn-golden"
            onClick={next}
            disabled={!hasNext}
            style={{ opacity: hasNext ? 1 : 0.4, cursor: hasNext ? 'pointer' : 'not-allowed', padding: '8px 18px' }}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  )
}
