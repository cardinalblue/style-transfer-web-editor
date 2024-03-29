'use client'

import { useEditorStore, useStickerStore } from '@/store'
import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { css, cva } from '@styled-system/css'
import { SearchIcon } from '@/components/icons/SearchIcon'

export const StickerPanel = () => {
  const [searchText, setSearchText] = useState<string>('')
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
    if (selectedBundleIndex === -1) {
      return stickerSearchList
    }
    return stickerList?.[selectedBundleIndex]?.stickers ?? []
  }, [selectedBundleIndex, stickerList, stickerSearchList])

  const {
    data: searchRes,
    isFetching: isSearchingStickers,
    refetch: onSearch,
  } = useQuery({
    queryKey: ['search-stickers'],
    queryFn: () => searchStickers(searchText.trim()),
    enabled: false,
  })

  useEffect(() => {
    if (searchRes) {
      updateStickerSearchResult(searchRes)
    }
  }, [searchRes])

  const { data: stickerRes, isFetching: isFetchingStickers } = useQuery({
    queryKey: ['fetch-stickers'],
    queryFn: fetchStickers,
  })

  useEffect(() => {
    if (stickerRes) {
      updateStickers(stickerRes)
    }
  }, [stickerRes])

  return (
    <div className={container}>
      <div className={bundleWrapper}>
        <div
          className={bundleThumbnail({ isIcon: true, isActive: selectedBundleIndex === -1 })}
          onClick={() => setSelectedBundleIndex(-1)}
        >
          <SearchIcon />
        </div>
        {stickerList.map((bundle, key) => (
          <div
            key={bundle.id}
            className={bundleThumbnail({ isActive: selectedBundleIndex === key })}
            style={{
              backgroundImage: `url(${bundle.thumbnail})`,
            }}
            onClick={() => setSelectedBundleIndex(key)}
          ></div>
        ))}
      </div>
      {selectedBundleIndex === -1 && (
        <input
          className={searchInput}
          type="text"
          placeholder="xmas, new year, etc."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchText.trim() !== '') {
              onSearch()
            }
          }}
        />
      )}
      {isFetchingStickers || isSearchingStickers ? (
        <div className={loadingText}>loading...</div>
      ) : (
        <div className={stickerContent}>
          {displayStickers.map((sticker) => (
            <div
              key={sticker.id}
              className={stickerPreview}
              style={{ backgroundImage: `url(${sticker.thumbnail})` }}
              onClick={() => addSticker(sticker.imageUrl)}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}
const container = css({
  w: '100%',
  h: '270px',
  px: 4,
  py: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  bgColor: '#333',
  lg: {
    w: '300px',
    h: '100%',
  },
})

const bundleWrapper = css({
  px: 2,
  py: 3,
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  overflowX: 'auto',
  overflowY: 'hidden',
})

const bundleThumbnail = cva({
  base: {
    w: '70px',
    h: '70px',
    flexShrink: 0,
    rounded: 'lg',
    cursor: 'pointer',
    position: 'relative',
    // thumbnail frame
    _before: {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      w: 'calc(100% + 10px)',
      h: 'calc(100% + 10px)',
      border: '1.5px solid #eee',
      rounded: 'xl',
      opacity: 0,
    },
    lg: {
      w: '80px',
      h: '80px',
    },
  },
  variants: {
    isActive: {
      true: {
        _before: {
          opacity: 1,
        },
      },
    },
    isIcon: {
      true: {
        p: 6,
        bgColor: '#eee',
        color: '#333',
      },
      false: {
        bg: 'no-repeat center / cover',
      },
    },
  },
  defaultVariants: {
    isIcon: false,
  },
})

const stickerContent = css({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,

  overflowX: 'hidden',
  overflowY: 'auto',
})

const stickerPreview = css({
  w: '70px',
  h: '70px',
  flexShrink: 0,
  rounded: 'lg',
  cursor: 'pointer',
  bg: 'no-repeat center / contain',
  lg: {
    w: '80px',
    h: '80px',
  },
})

const searchInput = css({
  appearance: 'none',
  all: 'unset',
  bgColor: '#eee',
  rounded: 'lg',
  px: 3,
  py: 2,
})

const loadingText = css({
  textAlign: 'center',
  color: '#eee',
})
