import { create } from 'zustand'
import { StickerShapeType } from '@/types'

const stickerUrl =
  'https://cdn.pic-collage.com/bundles/stickers_v2/merryandbright/stickers/32372/st_merry&bright_02_star.png'

type State = {
  // basic
  editorSize: { width: number; height: number }
  // content
  bgImage: string | null
  stickerShapes: StickerShapeType[]
  // temp
  selectedId: string | null
}

type Actions = {
  updateEditorSize: (width: number, height: number) => void
  addSticker: (id: string, url: string) => void
  removeSticker: (id?: string) => void
  updateSelectedId: (id: string | null) => void
}

const initialState: State = {
  editorSize: { width: 0, height: 0 },

  bgImage: null,
  stickerShapes: [{ id: '12345', url: stickerUrl }],

  selectedId: null,
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  ...initialState,

  updateEditorSize: (width, height) => set({ editorSize: { width, height } }),
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
