import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import CodeMirror from '@uiw/react-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { r } from '@codemirror/legacy-modes/mode/r'
import type { TopicId } from '../state/useStory'
import { R_TASKS } from './scripts'
import { runRTask } from './webrClient'

interface RStudioProps {
  topicId: TopicId
}

type RunState = 'idle' | 'running' | 'done' | 'error'

export function RStudio({ topicId }: RStudioProps) {
  const task = R_TASKS[topicId]
  const [code, setCode] = useState(task?.code ?? '')
  const [runState, setRunState] = useState<RunState>('idle')
  const [status, setStatus] = useState('Ambiente R pronto para execução.')
  const [consoleText, setConsoleText] = useState('')
  const [plotUrls, setPlotUrls] = useState<string[]>([])
  const [plotIndex, setPlotIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [shown, setShown] = useState(false)

  const extensions = useMemo(() => [StreamLanguage.define(r)], [])

  const hasPlot = plotUrls.length > 0
  const plotUrl = plotUrls[plotIndex] ?? ''

  // Two-step mount so the lightbox animates smoothly in and out.
  const openModal = useCallback(() => {
    setExpanded(true)
    requestAnimationFrame(() => setShown(true))
  }, [])

  const closeModal = useCallback(() => {
    setShown(false)
    window.setTimeout(() => setExpanded(false), 260)
  }, [])

  const showPreviousPlot = useCallback(() => {
    setPlotIndex((index) => Math.max(0, index - 1))
  }, [])

  const showNextPlot = useCallback(() => {
    setPlotIndex((index) => Math.min(plotUrls.length - 1, index + 1))
  }, [plotUrls.length])

  useEffect(() => {
    if (!expanded) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
      if (event.key === 'ArrowLeft') showPreviousPlot()
      if (event.key === 'ArrowRight') showNextPlot()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, closeModal, showPreviousPlot, showNextPlot])

  const handleRun = useCallback(async () => {
    if (!task || runState === 'running') return
    setRunState('running')
    setConsoleText('')
    setPlotUrls([])
    setPlotIndex(0)
    setStatus('Preparando execução...')
    try {
      const { consoleText: output, images } = await runRTask(
        { ...task, code },
        { onStatus: setStatus }
      )
      setConsoleText(output.trim() || '(análise executada sem saída de texto)')
      const urls = images.map((image) => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(image, 0, 0)
        }
        return canvas.toDataURL('image/png')
      })
      setPlotUrls(urls)
      setPlotIndex(0)
      setRunState('done')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setConsoleText(`Erro: ${message}`)
      setStatus('Falha na execução.')
      setRunState('error')
    }
  }, [task, code, runState])

  if (!task) return null

  const running = runState === 'running'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* IDE Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
            📜 {task.displayName}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: runState === 'error' ? '#dc2626' : '#16a34a',
              background:
                runState === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34, 197, 94, 0.12)',
              padding: '2px 8px',
              borderRadius: 999,
            }}
          >
            ● WebR
          </span>
        </div>
        <button
          className="btn-aqua"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          onClick={handleRun}
          disabled={running}
          aria-busy={running}
        >
          {running ? '▶ Executando...' : '▶ Executar R'}
        </button>
      </div>

      {/* Code Editor */}
      <div
        style={{
          borderRadius: 14,
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.15)',
          overflow: 'hidden',
          boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
        }}
      >
        <div
          style={{
            padding: '6px 12px',
            background: '#1e293b',
            color: '#94a3b8',
            fontSize: '0.72rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Editor R</span>
          <span>Editável</span>
        </div>
        <div style={{ maxHeight: 190, overflow: 'auto' }}>
          <CodeMirror
            value={code}
            height="180px"
            extensions={extensions}
            onChange={(value) => setCode(value)}
            theme="dark"
            basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
          />
        </div>
      </div>

      {/* Run status line */}
      <div
        style={{
          fontSize: '0.76rem',
          fontWeight: 600,
          color: runState === 'error' ? '#b91c1c' : 'var(--text-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: running ? '#f59e0b' : runState === 'error' ? '#dc2626' : '#16a34a',
            flexShrink: 0,
          }}
        />
        {status}
      </div>

      {/* Console output */}
      {consoleText && (
        <div
          style={{
            borderRadius: 12,
            background: '#0b1220',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '10px 12px',
            maxHeight: 120,
            overflow: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: '0.72rem',
              lineHeight: 1.5,
              color: '#cbd5e1',
              fontFamily: 'Consolas, Monaco, monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {consoleText}
          </pre>
        </div>
      )}

      {/* Plot Viewport */}
      <div
        style={{
          flex: 1,
          minHeight: 220,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.45)',
            borderBottom: '1px solid rgba(255,255,255,0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          <span>📊 Dispositivo gráfico (WebR)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--text-soft)' }}>
              {hasPlot
                ? plotUrls.length > 1
                  ? `gráfico ${plotIndex + 1}/${plotUrls.length}`
                  : 'renderizado'
                : 'aguardando'}
            </span>
            <button
              className="btn-aqua"
              disabled={!hasPlot}
              onClick={openModal}
              style={{
                padding: '4px 10px',
                fontSize: '0.7rem',
                opacity: hasPlot ? 1 : 0.45,
                cursor: hasPlot ? 'pointer' : 'not-allowed',
              }}
              aria-label="Ampliar gráfico"
              title="Ampliar gráfico"
            >
              ⤢ Ampliar
            </button>
          </div>
        </div>

        {plotUrls.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 6,
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.35)',
              borderBottom: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-soft)',
                marginRight: 2,
              }}
            >
              Gráficos gerados:
            </span>
            {plotUrls.map((_, i) => (
              <button
                key={i}
                type="button"
                className="plot-nav"
                onClick={() => setPlotIndex(i)}
                aria-label={`Ver gráfico ${i + 1}`}
                aria-pressed={i === plotIndex}
                style={
                  i === plotIndex
                    ? {
                        background: 'linear-gradient(135deg, #38e0ee, #0284c7)',
                        borderColor: 'transparent',
                        color: '#fff',
                      }
                    : undefined
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}
        >
          {hasPlot && (
            <img
              key={plotIndex}
              className="plot-swap"
              src={plotUrl}
              alt={`Gráfico ${plotIndex + 1} gerado em R`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
          )}
          <div
            style={{
              display: hasPlot ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              textAlign: 'center',
              color: 'var(--text-soft)',
              padding: 16,
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>📈</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
              Clique em “Executar R”
            </span>
            <span style={{ fontSize: '0.75rem', maxWidth: 340 }}>
              O gráfico será gerado no navegador via WebAssembly (WebR) e exibido aqui.
            </span>
          </div>
        </div>
      </div>

      {expanded &&
        plotUrl &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Gráfico ampliado"
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              background: 'rgba(8, 20, 32, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              opacity: shown ? 1 : 0,
              transition: 'opacity 260ms ease',
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 16,
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: '94vw',
                maxHeight: '94vh',
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.94)',
                transition: 'opacity 260ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 24,
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                  📊 {task.displayName}
                </span>
                <button
                  className="btn-aqua"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={closeModal}
                >
                  ✕ Fechar
                </button>
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  key={plotIndex}
                  className="plot-swap"
                  src={plotUrl}
                  alt={`Gráfico ${plotIndex + 1} gerado em R`}
                  style={{
                    maxWidth: '88vw',
                    maxHeight: '78vh',
                    objectFit: 'contain',
                    borderRadius: 12,
                  }}
                />
                {plotUrls.length > 1 && (
                  <button
                    type="button"
                    className="plot-nav plot-nav-lg"
                    onClick={showPreviousPlot}
                    disabled={plotIndex === 0}
                    aria-label="Gráfico anterior"
                    title="Gráfico anterior"
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    ◀
                  </button>
                )}
                {plotUrls.length > 1 && (
                  <button
                    type="button"
                    className="plot-nav plot-nav-lg"
                    onClick={showNextPlot}
                    disabled={plotIndex === plotUrls.length - 1}
                    aria-label="Próximo gráfico"
                    title="Próximo gráfico"
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    ▶
                  </button>
                )}
              </div>
              {plotUrls.length > 1 && (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-soft)',
                  }}
                >
                  Gráfico {plotIndex + 1} de {plotUrls.length}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
