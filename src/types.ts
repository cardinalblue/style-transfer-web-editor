export type StickerShapeType = {
  id: string
  url: string
}

export type StickerItemType = {
  id: string
  thumbnail: string
  imageUrl: string
}

export type StickerBundleItemType = {
  id: string
  title: string
  thumbnail: string
  stickers: StickerItemType[]
}

export type StickerSearchItemType = StickerItemType & {
  bundleId: string
}
