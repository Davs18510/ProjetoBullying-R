import { useEffect, useRef } from 'react'
import { useStory, type TopicId } from '../state/useStory'
import { RStudio } from '../r/RStudio'

interface TopicSummary {
  id: TopicId
  number: string
  title: string
  bullets: string[]
  cvvNote?: boolean
}

const SECTIONS_DATA: TopicSummary[] = [
  {
    id: 'intro',
    number: '01',
    title: 'Introdução',
    bullets: [
      'Desafio Central: O bullying é um dos maiores problemas enfrentados no ambiente acadêmico, onde a principal dificuldade reside na forma de intervir e prevenir de maneira efetiva.',
      'Perfil da Vítima e Localidade: Investigação empírica de onde as agressões se concentram e qual o perfil representativo dos estudantes vulneráveis.',
      'Perfil do Agressor e Práticas: Mapeamento dos atos violentos mais recorrentes e das motivações comportamentais do agressor.',
      'Canais e Respostas Escolares: Identificação de a quem a vítima recorre e quais metodologias pedagógicas apresentam maior eficácia comprovada.',
      'Base de Dados Oficial: Pesquisa fundamentada nos microdados do PeNSE 2024 (Pesquisa Nacional de Saúde do Escolar) com análises estatísticas executadas em linguagem R.',
    ],
  },
  {
    id: 'mapeamento',
    number: '02',
    title: 'Mapeamento do bullying nas escolas',
    bullets: [
      'Faixa Etária Crítica: Grande parte das vítimas de bullying concentra-se entre 13 e 15 anos de idade.',
      'Distribuição por Gênero: Proporção semelhante entre estudantes masculinos e femininos, com bullying presencial mais acentuado no perfil feminino.',
      'Dispersão Territorial: Ocorrência homogênea em todas as regiões do país, refutando o mito de que o bullying restringe-se a periferias ou apenas escolas públicas.',
      'Urgência Universal: Todas as instituições de ensino demandam planos de ação estruturados, sem exceção de rede ou localidade.',
    ],
  },
  {
    id: 'pratica',
    number: '03',
    title: 'A prática do bullying',
    bullets: [
      'Análise do Autor da Violência: Poucas escolas analisam o agressor; mapear suas características é vital para intervir antes que a violência se consume.',
      'Semelhança de Perfil: O perfil do agressor assemelha-se ao da vítima em faixa etária e contexto, com leve concentração relatada em escolas públicas.',
      'Tipos de Agressão: Agressões físicas e verbais diretas continuam predominantes, somadas à expansão contínua do cyberbullying.',
      'Origem do Comportamento: Condutas agressivas frequentemente expressam conflitos domésticos ou fragilidade familiar, exigindo diálogo e mentoria em vez de apenas sanção.',
    ],
  },
  {
    id: 'denuncias',
    number: '04',
    title: 'Padrões das denúncias e métodos de intervenção',
    bullets: [
      'Canais de Confiança: Vítimas recorrem primariamente a familiares e pessoas próximas de confiança; minoria inicial aciona professores.',
      'Necessidade de Segurança Psicológica: A escola deve construir um ambiente em que os profissionais transmitam a mesma segurança que os laços familiares.',
      'Apoio Pessoal Direto: Entre todos os métodos de intervenção escolar, o apoio individualizado e direto à vítima demonstra ser o mais resolutivo.',
      'Prevenção Contínua: Criar núcleos de escuta ativa no cotidiano escolar reduz de forma significativa a reincidência de abusos.',
    ],
  },
  {
    id: 'saude',
    number: '05',
    title: 'Relação do bullying com doenças mentais',
    bullets: [
      'Impacto Psíquico Profundo: O bullying ultrapassa o dano momentâneo e produz sequelas duradouras na saúde mental.',
      'Associação Estatística: Dados comprovam o aumento drástico de sintomas depressivos e ansiosos entre estudantes vitimizados.',
      'Risco Extremo: A persistência do sofrimento pode evoluir para quadros graves de automutilação e ideação suicida.',
      'Urgência Absoluta: Danos potencialmente irreversíveis demandam que a prevenção seja tratada como prioridade máxima de saúde pública.',
    ],
    cvvNote: true,
  },
  {
    id: 'solucoes',
    number: '06',
    title: 'Soluções e Propostas Práticas',
    bullets: [
      'Conscientização e Sensibilização Pública: Esclarecimento amplo para toda a comunidade escolar sobre os efeitos devastadores e a gravidade do crime.',
      'Escola como Segunda Família: Transformar o espaço acadêmico em ambiente de amparo genuíno, onde as vítimas sintam acolhimento imediato de professores e coordenadores.',
      'Mentoria para o Agressor: Criação de programas de acompanhamento e diálogo com os agressores para desarmar comportamentos violentos na raiz.',
      'Decisões Baseadas em Evidências: Intervenções fundamentadas em dados reais do PeNSE 2024 para resultados estruturais e duradouros.',
    ],
  },
]

export function Scrollytelling() {
  const activeSection = useStory((s) => s.activeSection)
  const setActiveSection = useStory((s) => s.setActiveSection)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // IntersectionObserver to sync scroll position with 3D camera zoom & active section
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionRefs.current.forEach((el, index) => {
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
              setActiveSection(index)
            }
          })
        },
        { threshold: [0.45, 0.7] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [setActiveSection])

  const scrollTo = (index: number) => {
    const el = sectionRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        minHeight: '100%',
      }}
    >
      {/* ── Fixed Side Navigation Dots (Quick Zoom Jump) ── */}
      <nav
        aria-label="Navegação do Scrollytelling"
        style={{
          position: 'fixed',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 40,
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.7)',
          padding: '12px 8px',
          borderRadius: 999,
          boxShadow: '0 8px 24px rgba(10,143,176,0.12)',
        }}
      >
        {SECTIONS_DATA.map((s, idx) => {
          const isActive = idx === activeSection
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(idx)}
              aria-label={`Ir para ${s.title}`}
              style={{
                width: 10,
                height: isActive ? 26 : 10,
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(180deg, #38e0ee, #0284c7)'
                  : 'rgba(2, 132, 199, 0.3)',
                boxShadow: isActive ? '0 0 10px rgba(56,224,238,0.7)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0,
              }}
            />
          )
        })}
      </nav>

      {/* ── SECTIONS ── */}
      {SECTIONS_DATA.map((item, idx) => {
        const isIntro = idx === 0
        const isConclusion = idx === 5
        const hasIDE = !isIntro && !isConclusion

        return (
          <section
            key={item.id}
            id={`section-${item.id}`}
            ref={(el) => {
              sectionRefs.current[idx] = el
            }}
            style={{
              minHeight: '100vh',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            {/* ── SECTION 0: INTRODUÇÃO (Hero Glass Card com Resumo em Tópicos) ── */}
            {isIntro && (
              <div
                className="glass"
                style={{
                  maxWidth: '820px',
                  width: '100%',
                  borderRadius: 28,
                  padding: 'clamp(28px, 4vw, 44px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  boxShadow: '0 24px 60px rgba(10,143,176,0.15)',
                  margin: 'auto',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 14px',
                      borderRadius: 999,
                      background: 'linear-gradient(135deg, #38e0ee, #0284c7)',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      marginBottom: 10,
                      boxShadow: '0 4px 12px rgba(2,132,199,0.25)',
                    }}
                  >
                    PESQUISA ESTATÍSTICA · PeNSE 2024
                  </span>
                  <h1
                    style={{
                      fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
                      fontWeight: 800,
                      color: 'var(--text)',
                      margin: '0 0 6px',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    Projeto Bullying
                  </h1>
                  <p
                    style={{
                      fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                      color: 'var(--text-soft)',
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    Mapeamento, Consequências e Intervenções Baseadas em Dados Reais
                  </p>
                </div>

                {/* Resumo em Tópicos da Introdução */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    background: 'rgba(255,255,255,0.4)',
                    padding: '20px 24px',
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.7)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      margin: '0 0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    📋 Síntese da Pesquisa
                  </h2>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {item.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        style={{
                          fontSize: '0.92rem',
                          lineHeight: 1.6,
                          color: 'var(--text)',
                        }}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: 4 }}>
                  <button
                    className="btn-aqua"
                    onClick={() => scrollTo(1)}
                    style={{ padding: '12px 32px', fontSize: '1rem' }}
                  >
                    Iniciar Scrollytelling ↓
                  </button>
                </div>
              </div>
            )}

            {/* ── SECTIONS 1 to 4: TÓPICOS COM RESUMO À ESQUERDA, 3D NO CENTRO E IDE R À DIREITA ── */}
            {hasIDE && (
                <div
                style={{
                  width: '100%',
                  maxWidth: '1660px',
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  gap: 24,
                  position: 'relative',
                }}
              >
                {/* Left Card: Resumo do Tópico */}
                <div
                  className="glass"
                  style={{
                    flex: '0 1 460px',
                    maxWidth: '460px',
                    borderRadius: 24,
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 20px 50px rgba(10,143,176,0.12)',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 12px',
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #38e0ee, #0284c7)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginBottom: 10,
                        letterSpacing: '0.04em',
                      }}
                    >
                      TÓPICO {item.number}
                    </span>
                    <h2
                      style={{
                        fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)',
                        fontWeight: 800,
                        color: 'var(--text)',
                        lineHeight: 1.25,
                        margin: '0 0 16px',
                      }}
                    >
                      {item.title}
                    </h2>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      {item.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            color: 'var(--text)',
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--aqua-deep)',
                              fontWeight: 800,
                              fontSize: '1rem',
                              lineHeight: 1.4,
                            }}
                          >
                            •
                          </span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {item.cvvNote && (
                    <div
                      style={{
                        marginTop: 20,
                        padding: '12px 16px',
                        borderRadius: 14,
                        background: 'rgba(2, 132, 199, 0.08)',
                        border: '1px solid rgba(2, 132, 199, 0.25)',
                        fontSize: '0.82rem',
                        color: 'var(--text-soft)',
                        lineHeight: 1.5,
                      }}
                    >
                      💙{' '}
                      <em>
                        Se você ou alguém que você conhece está passando por sofrimento, o{' '}
                        <strong style={{ color: 'var(--aqua-deep)' }}>CVV</strong> (188, ligação
                        gratuita, 24h) pode ajudar.
                      </em>
                    </div>
                  )}
                </div>

                {/* Symmetrical center gap: equal breathing room on both sides of
                    the character so it stays clearly visible between the cards */}
                <div
                  style={{
                    flex: '0 0 clamp(340px, 32vw, 600px)',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                />

                {/* Right Card: IDE Interativo em R */}
                <div
                  className="glass"
                  style={{
                    flex: '0 1 460px',
                    maxWidth: '460px',
                    borderRadius: 24,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 20px 50px rgba(10,143,176,0.12)',
                  }}
                >
                  <RStudio topicId={item.id} />
                </div>
              </div>
            )}

            {/* ── SECTION 5: CONCLUSÃO / SOLUÇÕES (CASA 3D NO CENTRO + SOMENTE O RESUMO) ── */}
            {isConclusion && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '1280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 32,
                  position: 'relative',
                  opacity: activeSection === 5 ? 1 : 0,
                  transform: activeSection === 5 ? 'translateY(0)' : 'translateY(28px)',
                  transition: 'opacity 0.9s ease, transform 0.9s ease',
                }}
              >
                {/* Left: Summary Card (ONLY SUMMARY AS REQUESTED) */}
                <div
                  className="glass"
                  style={{
                    flex: '1 1 480px',
                    maxWidth: '540px',
                    borderRadius: 28,
                    padding: '36px',
                    boxShadow: '0 24px 60px rgba(10,143,176,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #38e0ee, #0284c7)',
                        color: '#fff',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        marginBottom: 10,
                        letterSpacing: '0.04em',
                      }}
                    >
                      TÓPICO 06 · CONCLUSÃO
                    </span>
                    <h2
                      style={{
                        fontSize: 'clamp(1.4rem, 2.6vw, 1.8rem)',
                        fontWeight: 800,
                        color: 'var(--text)',
                        margin: '0 0 6px',
                      }}
                    >
                      {item.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-soft)',
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      Diretrizes práticas extraídas das evidências estatísticas
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    {item.bullets.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          fontSize: '0.94rem',
                          lineHeight: 1.6,
                          color: 'var(--text)',
                          background: 'rgba(255,255,255,0.4)',
                          padding: '12px 16px',
                          borderRadius: 16,
                          border: '1px solid rgba(255,255,255,0.65)',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--aqua-deep)',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn-aqua"
                      onClick={() => scrollTo(0)}
                      style={{ padding: '10px 24px' }}
                    >
                      ↑ Voltar ao Início
                    </button>
                  </div>
                </div>

                {/* Right spacer: keeps the summary card on the left while the
                    3D house sanctuary model is showcased on the right / grass */}
                <div
                  style={{
                    flex: '1 1 400px',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                />
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
