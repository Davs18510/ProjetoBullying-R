import { useEffect, useCallback, Component, type ReactNode } from 'react'
import './styles/theme.css'
import { Scene } from './scene/Scene'
import { TopicPanel } from './ui/TopicPanel'
import { MobileMenu } from './ui/MobileMenu'
import { useStory, TOPIC_ORDER, type TopicId } from './state/useStory'
import { TOPICS } from './content/topics'

// ── WebGL + mobile detection ──────────────────────────────────────────────
function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      (canvas.getContext as (id: string) => RenderingContext | null)('experimental-webgl')
    )
  } catch {
    return false
  }
}

const IS_MOBILE = window.innerWidth < 640
const HAS_WEBGL = canUseWebGL()
const USE_3D = !IS_MOBILE && HAS_WEBGL

// ── Error Boundary ────────────────────────────────────────────────────────
interface EBState { hasError: boolean; message: string }
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: '' }
  static getDerivedStateFromError(e: Error): EBState {
    return { hasError: true, message: e.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32,
        }}>
          <h2 style={{ color: 'var(--text)', fontWeight: 700 }}>Erro ao carregar a cena 3D</h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400 }}>
            {this.state.message || 'Erro desconhecido. Verifique o console (F12).'}
          </p>
          <button className="btn-aqua" onClick={() => this.setState({ hasError: false, message: '' })}>
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Keyboard-accessible hidden DOM tab buttons (for 3D hub) ──────────────
const TAB_LABELS: Record<TopicId, string> = {
  intro: 'Introdução',
  mapeamento: 'Mapeamento do bullying nas escolas',
  pratica: 'A prática do bullying',
  denuncias: 'Padrões das denúncias e métodos de intervenção',
  saude: 'Relação do bullying com doenças mentais',
  solucoes: 'Soluções',
}

function HubOverlay() {
  const view = useStory((s) => s.view)
  const openTopic = useStory((s) => s.openTopic)

  if (view !== 'hub') return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* Top-left title */}
      <div style={{ position: 'absolute', top: 28, left: 32, pointerEvents: 'auto' }}>
        <h1 style={{
          fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text)',
          textShadow: '0 2px 16px rgba(255,255,255,0.95)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Projeto Bullying
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: 4, fontWeight: 600 }}>
          Pesquisa estatística · PeNSE 2024
        </p>
      </div>

      {/* Bottom hint */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,248,240,0.55)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.75)',
        borderRadius: 999,
        padding: '8px 22px',
        fontSize: '0.8rem',
        color: 'var(--text)',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 18px rgba(217,119,36,0.18)',
      }}>
        ✨ Selecione um card para abrir a IDE em R · arraste para olhar ao redor
      </div>

      {/* Visually hidden keyboard nav */}
      <nav aria-label="Navegação pelos tópicos" style={{ position: 'absolute', top: -9999, left: -9999 }}>
        {TOPIC_ORDER.map((id) => (
          <button key={id} id={`hub-btn-${id}`} onClick={() => openTopic(id)} style={{ pointerEvents: 'auto' }}>
            {TAB_LABELS[id]}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ── Mobile TopicPanel ────────────────────────────────────────────────────
function MobileTopicPanel() {
  const view = useStory((s) => s.view)
  const close = useStory((s) => s.close)
  const next = useStory((s) => s.next)
  const prev = useStory((s) => s.prev)
  const openTopic = useStory((s) => s.openTopic)

  const isOpen = view !== 'hub'
  const topic = isOpen ? TOPICS.find((t) => t.id === view) : undefined
  const currentIndex = isOpen ? TOPIC_ORDER.indexOf(view as TopicId) : -1

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }, [isOpen, close, next, prev])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div
      role="dialog"
      aria-modal={isOpen}
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'linear-gradient(180deg, #fdf6ec 0%, #fee4c3 100%)',
        overflowY: 'auto',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(.22,.9,.3,1)',
        padding: '0 0 80px',
      }}
    >
      {/* Sticky header */}
      <div style={{
        padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.6)',
        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 2,
      }}>
        <button aria-label="Voltar" onClick={close} style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.6)',
          cursor: 'pointer', fontSize: '1rem', color: 'var(--text)',
        }}>←</button>
        <div>
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 999,
            background: 'linear-gradient(135deg, #ffc46b, #d97724)',
            color: '#fff', fontSize: '0.7rem', fontWeight: 700, marginBottom: 2,
          }}>TÓPICO {topic?.number}</span>
          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text)' }}>
            {topic?.title}
          </div>
        </div>
      </div>

      {/* R IDE Interactive Area */}
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffc46b, #d97724)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: '#fff',
          }}>{topic?.presenter?.charAt(0)}</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-soft)', fontWeight: 600 }}>
            Apresentação: {topic?.presenter}
          </span>
        </div>

        {/* Script Editor Frame */}
        <div style={{
          borderRadius: 14, background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
            background: '#0f172a', fontSize: '0.72rem', color: '#94a3b8',
          }}>
            <span>⚡ Script R Interativo</span>
            <span style={{ color: '#22c55e' }}>● WebR Pronto</span>
          </div>
          <pre style={{
            margin: 0, padding: '12px', fontSize: '0.75rem', color: '#f8fafc',
            lineHeight: 1.55, overflowX: 'auto', maxHeight: 150,
          }}>
            <code>{`# Ambiente R PeNSE 2024\nlibrary(ggplot2)\nlibrary(dplyr)\n\n# Pronto para execução na Fase 3`}</code>
          </pre>
        </div>

        {/* Graph Preview */}
        <div style={{
          padding: '24px 16px', borderRadius: 14,
          background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.8)',
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: '1.8rem' }}>📊</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
            Gráfico Estatístico R em Tempo Real
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>
            Ambiente interativo pronto para a Fase 3
          </span>
        </div>

        {topic?.cvvNote && (
          <div style={{
            padding: '12px 14px', borderRadius: 12,
            background: 'rgba(217,119,36,0.12)', border: '1px solid rgba(217,119,36,0.25)',
            fontSize: '0.8rem', color: 'var(--text-soft)',
          }}>
            💙 <em>Se você ou alguém que você conhece está passando por sofrimento, o{' '}
            <strong style={{ color: 'var(--golden-deep)' }}>CVV</strong> (188, ligação gratuita, 24h) pode ajudar.</em>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 20px',
        background: 'rgba(255,248,240,0.85)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.6)',
        display: 'flex', gap: 10, zIndex: 3,
      }}>
        <button className="btn-golden" onClick={prev} disabled={currentIndex <= 0} style={{ opacity: currentIndex > 0 ? 1 : 0.4, padding: '8px 16px' }}>
          ← Anterior
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {TOPIC_ORDER.map((id) => (
            <button key={id} onClick={() => openTopic(id)} aria-current={id === view ? 'step' : undefined} style={{
              width: id === view ? 24 : 8, height: 8, borderRadius: 999, border: 'none',
              cursor: 'pointer', padding: 0,
              background: id === view ? 'linear-gradient(90deg, #ffc46b, #d97724)' : 'rgba(217,119,36,0.25)',
              transition: 'all 0.3s',
            }}/>
          ))}
        </div>
        <button className="btn-golden" onClick={next} disabled={currentIndex >= TOPIC_ORDER.length - 1}
          style={{ opacity: currentIndex < TOPIC_ORDER.length - 1 ? 1 : 0.4, padding: '8px 16px' }}>
          Próximo →
        </button>
      </div>
    </div>
  )
}

// ── Root App ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {USE_3D ? (
        <>
          <SceneErrorBoundary>
            <Scene />
          </SceneErrorBoundary>
          <HubOverlay />
          <TopicPanel />
        </>
      ) : (
        <>
          <MobileMenu />
          <MobileTopicPanel />
        </>
      )}
    </div>
  )
}
