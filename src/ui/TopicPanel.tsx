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
        marginTop: 16,
        padding: '12px 16px',
        borderRadius: 14,
        background: 'rgba(10,143,176,0.1)',
        border: '1px solid rgba(25,198,214,0.3)',
        fontSize: '0.82rem',
        color: 'var(--text-soft)',
        lineHeight: 1.55,
      }}
    >
      💙{' '}
      <em>
        Se você ou alguém que você conhece está passando por sofrimento, o{' '}
        <strong style={{ color: 'var(--aqua-deep)' }}>CVV</strong> (188, ligação
        gratuita, 24h) pode ajudar.
      </em>
    </div>
  )
}

export function TopicPanel() {
  const view = useStory((s) => s.view)
  const close = useStory((s) => s.close)
  const next = useStory((s) => s.next)
  const prev = useStory((s) => s.prev)

  const isOpen = view !== 'hub'
  const topic = isOpen ? getTopicById(view as TopicId) : undefined

  const currentIndex = isOpen ? TOPIC_ORDER.indexOf(view as TopicId) : -1
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
      role="dialog"
      aria-modal={isOpen}
      aria-label={topic ? `Tópico: ${topic.title}` : undefined}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(560px, 92vw)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 20,
        pointerEvents: isOpen ? 'auto' : 'none',
        padding: '20px 20px 20px 0',
        transform: isOpen ? 'translateX(0)' : 'translateX(110%)',
        transition: 'transform 0.45s cubic-bezier(.22,.9,.3,1)',
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.4)',
            position: 'relative',
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Number badge */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #19c6d6, #0a8fb0)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: '0.04em',
                }}
              >
                {topic?.number}
              </span>

              <h2
                style={{
                  fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.3,
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
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7ed957, #3fae3a)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {topic?.presenter?.charAt(0)}
                </span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-soft)',
                    fontWeight: 600,
                  }}
                >
                  {topic?.presenter}
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
                border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: 'var(--text-soft)',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.55)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.3)')
              }
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 28px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {topic?.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: '0.92rem',
                color: 'var(--text)',
                lineHeight: 1.75,
                marginBottom: i < (topic.paragraphs.length - 1) ? 16 : 0,
              }}
            >
              {p}
            </p>
          ))}

          {/* Graph placeholder — Phase 3 will replace this */}
          {topic?.hasGraphs && (
            <div
              style={{
                marginTop: 24,
                padding: '18px',
                borderRadius: 16,
                background: 'rgba(25,198,214,0.08)',
                border: '1px dashed rgba(25,198,214,0.4)',
                textAlign: 'center',
                color: 'var(--text-soft)',
                fontSize: '0.82rem',
              }}
            >
              📊 Gráficos interativos em R serão carregados na Fase 3
            </div>
          )}

          {topic?.cvvNote && <CvvNote />}
        </div>

        {/* Footer navigation */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            aria-label="Tópico anterior"
            className="btn-aqua"
            onClick={prev}
            disabled={!hasPrev}
            style={{ opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
          >
            ← Anterior
          </button>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {isOpen && <StoryNav currentId={view as TopicId} />}
          </div>

          <button
            aria-label="Próximo tópico"
            className="btn-aqua"
            onClick={next}
            disabled={!hasNext}
            style={{ opacity: hasNext ? 1 : 0.4, cursor: hasNext ? 'pointer' : 'not-allowed' }}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  )
}
