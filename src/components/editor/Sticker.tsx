'use client'

import { useEffect, useRef, useState } from 'react'
import Konva from 'konva'
import { Image } from 'react-konva'
import useImage from 'use-image'
import { StickerShapeType } from '@/types'
import { useEditorStore } from '@/store'
import { MAX_STICKER_RATIO } from '@/utils/constants'

interface StickerProps {
  stickerInfo: StickerShapeType
  onChange: () => void
}

export const Sticker = ({ stickerInfo, onChange }: StickerProps) => {
  const [base64, setBase64] = useState<string>('')
  const [image] = useImage(base64, 'anonymous')
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 })

  const shapeRef = useRef<Konva.Image>(null)

  const { bgImageSize, selectedIds, updateSelectedIds } = useEditorStore()

  const onChangeStart = () => {
    if (!selectedIds.includes(stickerInfo.id)) {
      updateSelectedIds(stickerInfo.id)
    }
  }

  useEffect(() => {
    if (!image) {
      return
    }
    const maxStickerSize = Math.min(
      bgImageSize.width * MAX_STICKER_RATIO,
      bgImageSize.height * MAX_STICKER_RATIO
    )
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, maxStickerSize / currentMaxSize)
    setSize({ width: image.width * ratio, height: image.height * ratio })

    // wait for image load before screenshot
    const mockImage = new window.Image()
    mockImage.src = base64
    mockImage.onload = () => onChange()
  }, [image])

  useEffect(() => {
    const x = (bgImageSize.width - size.width) / 2
    const y = (bgImageSize.height - size.height) / 2
    setDefaultPosition({ x, y })
  }, [size])

  const stickerToBase64 = async () => {
    const res = await fetch(`/api/pico-asset?url=${encodeURIComponent(stickerInfo.url)}`)
    const data = await res.json()
    setBase64(data.dataUrl)
  }

  useEffect(() => {
    stickerToBase64()
    return () => {
      shapeRef.current?.destroy()
      onChange()
    }
  }, [])

  return (
    <Image
      data-shape-id={stickerInfo.id}
      id={stickerInfo.id}
      ref={shapeRef}
      x={defaultPosition.x}
      y={defaultPosition.y}
      width={size?.width}
      height={size?.height}
      draggable
      alt=""
      image={image}
      onDragStart={onChangeStart}
      onTransformStart={onChangeStart}
      onDragEnd={onChange}
      onTransformEnd={onChange}
    />
  )
}
