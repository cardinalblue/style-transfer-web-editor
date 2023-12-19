'use client'

import { useEditorStore, useStickerStore } from '@/store'
import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { css } from '@styled-system/css'

export const StickerPanel = () => {
  const {
    stickerList,
    stickerSearchList,
    fetchStickers,
    updateStickers,
    searchStickers,
    updateStickerSearchResult,
  } = useStickerStore()

  const { addSticker } = useEditorStore()

  const [selectedBundleIndex, setSelectedBundleIndex] = useState<number>(0)

  const displayStickers = useMemo(() => {
    return stickerList?.[selectedBundleIndex]?.stickers ?? []
  }, [selectedBundleIndex, stickerList])

  const { data, isFetching, error } = useQuery({
    queryKey: ['fetch-stickers'],
    queryFn: fetchStickers,
  })

  useEffect(() => {
    if (data) {
      updateStickers(data)
    }
  }, [data])

  return (
    <>
      <div className={bundleContaier}>
        {stickerList.map((bundle, key) => (
          <div
            key={bundle.id}
            className={bundleThumbnail}
            style={{
              backgroundImage: `url(${bundle.thumbnail})`,
            }}
            onClick={() => setSelectedBundleIndex(key)}
          ></div>
        ))}
      </div>
      <div className={stickerContent}>
        {displayStickers.map((sticker) => (
          <div
            key={sticker.id}
            className={stickerPreview}
            style={{ backgroundImage: `url(${sticker.thumbnail})` }}
            onClick={() => {
              addSticker(sticker.id, sticker.imageUrl)
            }}
          ></div>
        ))}
      </div>
    </>
  )
}

const bundleContaier = css({
  py: 3,
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  overflowX: 'auto',
  overflowY: 'hidden',
})

const bundleThumbnail = css({
  width: '100px',
  height: '100px',
  flexShrink: 0,
  rounded: 'lg',
  cursor: 'pointer',
  background: 'no-repeat center / cover',
})

const stickerContent = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
})

const stickerPreview = css({
  width: '100px',
  height: '100px',
  flexShrink: 0,
  rounded: 'lg',
  cursor: 'pointer',
  background: 'no-repeat center / contain',
})
