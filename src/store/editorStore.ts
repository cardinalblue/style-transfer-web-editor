import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { StickerShapeType } from '@/types'

type State = {
  // basic
  bgImageSize: { width: number; height: number }
  // content
  bgImage: string
  stickerShapes: StickerShapeType[]
  editorScreenshot: string
  // temp
  selectedId: string | null
  highlightUploadBtn: boolean
}

type Actions = {
  updateBgImageSize: (width: number, height: number) => void
  updateBgImage: (url: string) => void
  updateEditorScreenshot: (url: string) => void

  addSticker: (url: string) => void
  removeSticker: (id?: string) => void
  updateSelectedId: (id: string | null) => void
  handleUploadHint: (status: boolean) => void
}

const initialState: State = {
  bgImageSize: { width: 0, height: 0 },

  bgImage: '',
  stickerShapes: [],
  editorScreenshot: '',

  selectedId: null,
  highlightUploadBtn: false,
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  ...initialState,

  updateBgImageSize: (width, height) => set({ bgImageSize: { width, height } }),
  updateBgImage: (url) => set({ ...initialState, bgImage: url }),
  updateEditorScreenshot: (url) => set({ editorScreenshot: url }),

  addSticker: (url) =>
    set((state) => {
      if (!state.bgImage) {
        get().handleUploadHint(true)
        return {}
      }
      const id = uuid()
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
  handleUploadHint: (status) => {
    set({ highlightUploadBtn: status })
    if (status) {
      setTimeout(() => get().handleUploadHint(false), 1200)
    }
  },
}))
