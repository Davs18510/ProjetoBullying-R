import './styles/theme.css'
import { Scene } from './scene/Scene'
import { useStory, TOPIC_ORDER, TopicId } from './state/useStory'

// Keyboard-accessible hidden buttons mirroring the 6 orbit tabs
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
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 36,
          pointerEvents: 'auto',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text)',
            textShadow: '0 2px 12px rgba(255,255,255,0.9)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Projeto Bullying
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-soft)',
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          Pesquisa estatística · PeNSE 2024
        </p>
      </div>

      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 999,
          padding: '8px 20px',
          fontSize: '0.82rem',
          color: 'var(--text-soft)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        Clique em uma aba para explorar · arraste para girar
      </div>

      {/* Visually hidden keyboard buttons */}
      <nav aria-label="Tópicos" style={{ position: 'absolute', top: -9999, left: -9999 }}>
        {TOPIC_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => openTopic(id)}
            style={{ pointerEvents: 'auto' }}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </nav>
    </div>
  )
}

function TopicPlaceholder() {
  const view = useStory((s) => s.view)
  const close = useStory((s) => s.close)
  const next = useStory((s) => s.next)
  const prev = useStory((s) => s.prev)

  if (view === 'hub') return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(560px, 92vw)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        pointerEvents: 'none',
        padding: '24px 24px 24px 0',
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          height: '80%',
          borderRadius: 'var(--radius)',
          padding: '32px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 600, zIndex: 1 }}>
          Tópico: <strong style={{ color: 'var(--aqua-deep)' }}>{view}</strong>
        </p>
        <p style={{ color: 'var(--text)', zIndex: 1 }}>
          Conteúdo completo será adicionado na Fase 2.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto', zIndex: 1 }}>
          <button className="btn-aqua" onClick={prev}>← Anterior</button>
          <button className="btn-aqua" onClick={next}>Próximo →</button>
          <button
            onClick={close}
            style={{
              marginLeft: 'auto',
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid var(--glass-border)',
              background: 'transparent',
              color: 'var(--text-soft)',
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ✕ Hub
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Scene />
      <HubOverlay />
      <TopicPlaceholder />
    </div>
  )
}
