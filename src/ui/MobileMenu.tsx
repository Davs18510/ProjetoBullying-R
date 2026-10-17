import { useStory } from '../state/useStory'
import { TOPICS } from '../content/topics'

export function MobileMenu() {
  const openTopic = useStory((s) => s.openTopic)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '24px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text)',
            textShadow: '0 2px 10px rgba(255,255,255,0.8)',
            letterSpacing: '-0.02em',
          }}
        >
          Projeto Bullying
        </h1>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 4 }}>
          Pesquisa estatística · PeNSE 2024
        </p>
      </div>

      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          id={`mobile-card-${topic.id}`}
          aria-label={`Abrir tópico: ${topic.title}`}
          onClick={() => openTopic(topic.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 20px',
            borderRadius: 18,
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            boxShadow: '0 4px 20px rgba(10,143,176,0.12)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 10px 30px rgba(217,119,36,0.25)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 4px 20px rgba(217,119,36,0.12)'
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffc46b, #d97724)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(217,119,36,0.35)',
            }}
          >
            {topic.number}
          </span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.3,
              }}
            >
              {topic.title}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-soft)',
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              {topic.presenter} · ⚡ IDE R
            </div>
          </div>
          <span style={{ color: 'var(--golden-deep)', fontSize: '1.2rem', fontWeight: 700 }}>›</span>
        </button>
      ))}
    </div>
  )
}
