import { create } from 'zustand'
import { StickerShapeType } from '@/types'

type State = {
  // basic
  editorSize: { width: number; height: number }
  // content
  bgImage: string
  stickerShapes: StickerShapeType[]
  previewImage: string
  // temp
  selectedId: string | null
}

type Actions = {
  updateEditorSize: (width: number, height: number) => void
  updateBgImage: (url: string) => void
  updatePreviewImage: (url: string) => void
  addSticker: (id: string, url: string) => void
  removeSticker: (id?: string) => void
  updateSelectedId: (id: string | null) => void
}

const initialState: State = {
  editorSize: { width: 0, height: 0 },

  bgImage: '',
  stickerShapes: [],
  previewImage: '',

  selectedId: null,
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  ...initialState,

  updateEditorSize: (width, height) => set({ editorSize: { width, height } }),
  updateBgImage: (url) => set({ bgImage: url, previewImage: '', stickerShapes: [] }),
  updatePreviewImage: (url) => set({ previewImage: url }),

  addSticker: (id, url) =>
    set((state) => {
      get().updateSelectedId(id)
      return { stickerShapes: [...state.stickerShapes, { id, url }] }
    }),
  removeSticker: (id) =>
    set((state) => {
      if (!id && state.selectedId) {
        id = state.selectedId
        get().updateSelectedId(null)
      }
      return { stickerShapes: state.stickerShapes.filter((el) => el.id !== id) }
    }),

  updateSelectedId: (id) => set({ selectedId: id }),
}))
