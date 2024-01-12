import { create } from 'zustand'
import { StickerBundleItemType, StickerSearchItemType } from '@/types'

type State = {
  stickerList: StickerBundleItemType[]
  stickerSearchList: StickerSearchItemType[]
}

type Actions = {
  fetchStickers: () => Promise<StickerBundleItemType[]>
  updateStickers: (list: StickerBundleItemType[]) => void
  searchStickers: (keyword: string) => Promise<StickerSearchItemType[]>
  updateStickerSearchResult: (list: StickerSearchItemType[]) => void
}

const initialState: State = {
  stickerList: [],
  stickerSearchList: [],
}

export const useStickerStore = create<State & Actions>((set, get) => ({
  ...initialState,

  fetchStickers: async () => {
    const res = await fetch('/api/sticker-list')
    const data = await res.json()
    return data.result.map((item: any) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumb_url,
      stickers: item.stickers.map((s: any) => ({
        id: s.id,
        thumbnail: s.thumb_url,
        imageUrl: s.image_url,
      })),
    }))
  },
  updateStickers: (list: StickerBundleItemType[]) => set({ stickerList: list }),

  searchStickers: async (keyword: string) => {
    const res = await fetch(`/api/sticker-search?query=${keyword}&limit=100`)
    const data = await res.json()
    return data.result.map((item: any) => ({
      id: item.id,
      thumbnail: item.thumb_url,
      imageUrl: item.image_url,
      bundleId: item.bundle_id,
    }))
  },
  updateStickerSearchResult: (list: StickerSearchItemType[]) => set({ stickerSearchList: list }),
}))
