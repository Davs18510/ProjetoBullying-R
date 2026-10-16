import { create } from 'zustand'

export type TopicId = 'intro' | 'mapeamento' | 'pratica' | 'denuncias' | 'saude' | 'solucoes'
export type View = 'hub' | TopicId

const TOPIC_ORDER: TopicId[] = ['intro', 'mapeamento', 'pratica', 'denuncias', 'saude', 'solucoes']

interface StoryState {
  view: View
  openTopic: (id: TopicId) => void
  close: () => void
  next: () => void
  prev: () => void
}

export const useStory = create<StoryState>((set, get) => ({
  view: 'hub',

  openTopic: (id) => set({ view: id }),

  close: () => set({ view: 'hub' }),

  next: () => {
    const { view } = get()
    if (view === 'hub') return
    const idx = TOPIC_ORDER.indexOf(view as TopicId)
    if (idx < TOPIC_ORDER.length - 1) set({ view: TOPIC_ORDER[idx + 1] })
  },

  prev: () => {
    const { view } = get()
    if (view === 'hub') return
    const idx = TOPIC_ORDER.indexOf(view as TopicId)
    if (idx > 0) set({ view: TOPIC_ORDER[idx - 1] })
  },
}))

export { TOPIC_ORDER }
