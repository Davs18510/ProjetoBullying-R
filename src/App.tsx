import { Component, useEffect, type ReactNode } from 'react'
import './styles/theme.css'
import { Scene } from './scene/Scene'
import { Scrollytelling } from './ui/Scrollytelling'
import { useStory } from './state/useStory'

// ── WebGL detection ────────────────────────────────────────────────────────
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

const HAS_WEBGL = canUseWebGL()

// ── Error Boundary ────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean
  message: string
}
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: '' }
  static getDerivedStateFromError(e: Error): EBState {
    return { hasError: true, message: e.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 32,
            background: 'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 100%)',
            zIndex: 1,
          }}
        >
          <h2 style={{ color: 'var(--text)', fontWeight: 700 }}>Erro ao carregar a cena 3D</h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400 }}>
            {this.state.message || 'Verifique o console (F12). O conteúdo pode ser visualizado via scroll.'}
          </p>
          <button
            className="btn-aqua"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Top Header Bar ───────────────────────────────────────────────────────
function TopHeader() {
  const next = useStory((s) => s.next)
  const prev = useStory((s) => s.prev)

  // Global keyboard shortcuts (arrow up/down)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        next()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        prev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 35,
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: '0 4px 20px rgba(10, 143, 176, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #38e0ee, #0284c7)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(2,132,199,0.3)',
          }}
        >
          📊
        </span>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>
            Projeto Bullying
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-soft)',
              marginLeft: 8,
              fontWeight: 600,
            }}
          >
            PeNSE 2024 · Scrollytelling
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={prev}
          aria-label="Tópico anterior"
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.5)',
            color: 'var(--text)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ↑ Anterior
        </button>
        <button
          onClick={next}
          aria-label="Próximo tópico"
          className="btn-aqua"
          style={{ padding: '6px 16px', fontSize: '0.8rem' }}
        >
          Próximo ↓
        </button>
      </div>
    </header>
  )
}

// ── Root App ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 100%)',
      }}
    >
      {/* 3D Scene in fixed background with smooth dynamic section zoom */}
      {HAS_WEBGL && (
        <SceneErrorBoundary>
          <Scene />
        </SceneErrorBoundary>
      )}

      {/* Persistent Glass Navigation Header */}
      <TopHeader />

      {/* Scrollytelling Content Flow */}
      <Scrollytelling />
    </div>
  )
}
