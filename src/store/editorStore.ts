import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { StickerItemType } from '@/types'

const stickerUrl =
  'https://cdn.pic-collage.com/bundles/stickers_v2/nostalgicchristmasdecor/stickers/92188/st_nostalgicchristmasdecor_HomeDeco_5.png'

type State = {
  // basic
  canvasSize: { width: number; height: number }
  // content
  imageUrl: string | null
  stickerList: StickerItemType[]
  // temp
  selectedId: string | null
}

type Actions = {
  updateCanvasSize: (width: number, height: number) => void
  addSticker: (url: string) => void
  removeSticker: (id?: string) => void
  updateSelectedId: (id: string | null) => void
}

const initialState: State = {
  canvasSize: { width: 0, height: 0 },

  imageUrl: null,
  stickerList: [{ id: uuid(), url: stickerUrl }],

  selectedId: null,
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  ...initialState,

  updateCanvasSize: (width, height) => set({ canvasSize: { width, height } }),
  addSticker: (url) =>
    set((state) => {
      const id = uuid()
      get().updateSelectedId(id)
      return { stickerList: [...state.stickerList, { id, url }] }
    }),
  removeSticker: (id) =>
    set((state) => {
      if (!id && state.selectedId) {
        id = state.selectedId
        get().updateSelectedId(null)
      }
      return { stickerList: state.stickerList.filter((el) => el.id !== id) }
    }),
  updateSelectedId: (id) => set({ selectedId: id }),
}))
