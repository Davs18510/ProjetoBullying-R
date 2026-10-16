import './styles/theme.css'

function App() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.02em',
        textShadow: '0 2px 8px rgba(255,255,255,0.8)',
      }}>
        Projeto Bullying
      </h1>
      <p style={{
        marginTop: '1rem',
        fontSize: '1.1rem',
        color: 'var(--text-soft)',
        fontWeight: 600,
      }}>
        Carregando experiência 3D…
      </p>
    </div>
  )
}

export default App
