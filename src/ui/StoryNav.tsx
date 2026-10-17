import { useStory, TOPIC_ORDER, type TopicId } from '../state/useStory'

interface StoryNavProps {
  currentId: TopicId
}

export function StoryNav({ currentId }: StoryNavProps) {
  const openTopic = useStory((s) => s.openTopic)

  return (
    <div
      role="navigation"
      aria-label="Progresso da apresentação"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
      }}
    >
      {TOPIC_ORDER.map((id, i) => {
        const isActive = id === currentId
        return (
          <button
            key={id}
            aria-label={`Tópico ${String(i + 1).padStart(2, '0')}`}
            aria-current={isActive ? 'step' : undefined}
            onClick={() => openTopic(id)}
            style={{
              width: isActive ? 28 : 10,
              height: 10,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              background: isActive
                ? 'linear-gradient(90deg, #ffc46b, #d97724)'
                : 'rgba(217,119,36,0.25)',
              boxShadow: isActive ? '0 0 10px rgba(255,190,89,0.7)' : 'none',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
          />
        )
      })}
    </div>
  )
}
