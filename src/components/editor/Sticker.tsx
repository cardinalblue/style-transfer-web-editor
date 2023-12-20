'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Konva from 'konva'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { css } from '@styled-system/css'
import { StickerShapeType } from '@/types'
import { useEditorStore } from '@/store'
import { MAX_STICKER_RATIO } from '@/utils/constants'

interface StickerProps {
  isSelected: boolean
  stickerInfo: StickerShapeType
  onChange: () => void
}

export const Sticker = ({ isSelected, stickerInfo, onChange }: StickerProps) => {
  const [base64, setBase64] = useState<string>('')
  const [image] = useImage(base64, 'anonymous')
  const [size, setSize] = useState({ width: 0, height: 0 })
  const shapeRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)

  const { editorSize, updateSelectedId } = useEditorStore()

  const defaultPosition = useMemo(() => {
    const x = (editorSize.width - size.width) / 2
    const y = (editorSize.height - size.height) / 2
    return { x, y }
  }, [editorSize, size])

  const onSelect = () => {
    updateSelectedId(stickerInfo.id)
  }

  useEffect(() => {
    if (!image) {
      return
    }
    const maxStickerSize = Math.min(
      editorSize.width * MAX_STICKER_RATIO,
      editorSize.height * MAX_STICKER_RATIO
    )
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, maxStickerSize / currentMaxSize)
    setSize({ width: image.width * ratio, height: image.height * ratio })
  }, [image, editorSize])

  const stickerToBase64 = async () => {
    const res = await fetch(`/api/pico-asset?url=${encodeURIComponent(stickerInfo.url)}`)
    const data = await res.json()
    setBase64(data.dataUrl)
  }

  useEffect(() => {
    stickerToBase64()
    return () => {
      shapeRef.current?.destroy()
      trRef.current?.destroy()
    }
  }, [])

  return (
    <>
      <Image
        data-sticker-id={stickerInfo.id}
        ref={shapeRef}
        x={defaultPosition.x}
        y={defaultPosition.y}
        width={size?.width}
        height={size?.height}
        draggable
        alt=""
        image={image}
        onDragEnd={onChange}
        onTransformEnd={onChange}
        onClick={onSelect}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
      />

      {shapeRef.current?.isVisible() && isSelected && (
        <Transformer
          ref={trRef}
          nodes={[shapeRef.current]}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          anchorStyleFunc={(anchor: Konva.Image) => {
            anchor.cornerRadius(10)
          }}
        />
      )}
    </>
  )
}

const container = css({
  bgColor: 'wheat',
})
