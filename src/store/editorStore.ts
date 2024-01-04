import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { StickerShapeType } from '@/types'
import { fileToBase64, compressImage } from '@/utils/helpers'
import { useStyleTransferStore } from './styleTransferStore'

type State = {
  bgImageSize: { width: number; height: number }
  bgImage: string
  stickerShapes: StickerShapeType[]
  editorScreenshot: string
  // temp
  selectedIds: string[]
  highlightUploadBtn: boolean
}

type Actions = {
  updateBgImageSize: (width: number, height: number) => void
  uploadBgImage: (file: File) => void
  updateBgImage: (url: string) => void
  updateEditorScreenshot: (url: string) => void

  addSticker: (url: string) => void
  removeSticker: (ids?: string[]) => void
  updateSelectedIds: (id: string, isMultiSelection?: boolean) => void
  handleUploadHint: (status: boolean) => void
}

const initialState: State = {
  bgImageSize: { width: 0, height: 0 },

  bgImage: '',
  stickerShapes: [],
  editorScreenshot: '',

  selectedIds: [],
  highlightUploadBtn: false,
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  ...initialState,

  updateBgImageSize: (width, height) => set({ bgImageSize: { width, height } }),
  uploadBgImage: async (file) => {
    if (!file) {
      return
    }
    // check image extension
    const imageExtensions = /image\/(jpg|jpeg|png)$/i
    if (imageExtensions.exec(file.type) === null) {
      return
    }

    file = await compressImage(file)
    const base64Image = await fileToBase64(file)
    get().updateBgImage(base64Image)

    // reset previous result
    const { updateStyleTransferResult } = useStyleTransferStore.getState()
    updateStyleTransferResult('')
  },
  updateBgImage: (url) => set({ ...initialState, bgImage: url }),
  updateEditorScreenshot: (url) => set({ editorScreenshot: url }),

  addSticker: (url) =>
    set((state) => {
      if (!state.bgImage) {
        get().handleUploadHint(true)
        return {}
      }
      const id = uuid()
      get().updateSelectedIds(id)
      return { stickerShapes: [...state.stickerShapes, { id, url }] }
    }),
  removeSticker: (ids) =>
    set((state) => {
      if (!ids?.length && state.selectedIds?.length) {
        ids = state.selectedIds
        get().updateSelectedIds('')
      }
      return { stickerShapes: state.stickerShapes.filter((el) => !ids?.includes(el.id)) }
    }),

  updateSelectedIds: (id, isMultiSelection) => {
    set((state) => {
      if (!id) {
        return { selectedIds: [] }
      }
      if (isMultiSelection) {
        // toggle selection
        const index = state.selectedIds.indexOf(id)
        const isNew = index === -1
        const ids = [...state.selectedIds]
        if (isNew) {
          ids.push(id)
        } else {
          ids.splice(index, 1)
        }
        return { selectedIds: ids }
      }
      // single selection
      return { selectedIds: [id] }
    })
  },

  handleUploadHint: (status) => {
    set({ highlightUploadBtn: status })
    if (status) {
      setTimeout(() => get().handleUploadHint(false), 1200)
    }
  },
}))
