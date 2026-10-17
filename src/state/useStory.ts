import { create } from 'zustand'

export type TopicId = 'intro' | 'mapeamento' | 'pratica' | 'denuncias' | 'saude' | 'solucoes'
export type View = 'hub' | TopicId

export const TOPIC_ORDER: TopicId[] = [
  'intro',
  'mapeamento',
  'pratica',
  'denuncias',
  'saude',
  'solucoes',
]

interface StoryState {
  activeSection: number
  view: View
  setActiveSection: (index: number) => void
  openTopic: (id: TopicId) => void
  close: () => void
  next: () => void
  prev: () => void
}

export const useStory = create<StoryState>((set, get) => ({
  activeSection: 0,
  view: 'intro',

  setActiveSection: (index: number) => {
    const clamped = Math.max(0, Math.min(TOPIC_ORDER.length - 1, index))
    set({
      activeSection: clamped,
      view: TOPIC_ORDER[clamped],
    })
  },

  openTopic: (id: TopicId) => {
    const idx = TOPIC_ORDER.indexOf(id)
    if (idx !== -1) {
      set({ activeSection: idx, view: id })
      const el = document.getElementById(`section-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },

  close: () => {
    set({ activeSection: 0, view: 'intro' })
    const el = document.getElementById('section-intro')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  },

  next: () => {
    const { activeSection } = get()
    if (activeSection < TOPIC_ORDER.length - 1) {
      const nextIdx = activeSection + 1
      get().setActiveSection(nextIdx)
      const el = document.getElementById(`section-${TOPIC_ORDER[nextIdx]}`)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  },

  prev: () => {
    const { activeSection } = get()
    if (activeSection > 0) {
      const prevIdx = activeSection - 1
      get().setActiveSection(prevIdx)
      const el = document.getElementById(`section-${TOPIC_ORDER[prevIdx]}`)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  },
}))
